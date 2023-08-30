import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GoogleOAuthGuard } from './google-auth.guard';
import { LoginDto } from './login.dto';
import { AuthService } from './auth.service';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DemoUserDto } from '../user/demo-user.dto';
import { UserService } from '../user/user.service';
import { faker } from '@faker-js/faker';
import { SocialLogin } from './social-login.enum';
import { ForgotPasswordDto } from './forgot-password.dto';
import { ResetPasswordDto } from './reset-password.dto';
import { LoginResponseDto } from './login-response.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private service: AuthService, private userService: UserService) {}

  @ApiOperation({ summary: 'Login using email and password' })
  @ApiResponse({
    status: 201,
    description: 'Login successful',
  })
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.service.login(loginDto);
  }

  @ApiOperation({ summary: 'Register from Demo' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
  })
  @Post('/register')
  async register(@Body() dto: DemoUserDto): Promise<LoginResponseDto> {
    await this.userService.createDemoUser(dto);

    return this.service.login({ email: dto.email, password: dto.password });
  }

  @ApiOperation({ summary: 'Google login to demo' })
  @ApiResponse({
    status: 200,
    description: 'Google login successful',
  })
  @Post('/google/login')
  async googleAuth(@Body('token') token): Promise<LoginResponseDto> {
    const googleUser = await this.service.googleLogin(token);

    const existingUser = await this.userService.findOneByEmail(
      googleUser.email,
    );

    if (existingUser) {
      return this.service.login(existingUser, true);
    }

    const newUser: DemoUserDto = {
      email: googleUser.email,
      firstName: googleUser.given_name,
      lastName: googleUser.family_name,
      password: faker.internet.password(),
      socialLogin: SocialLogin.GOOGLE,
      socialId: googleUser.sub,
    };

    const user = await this.userService.createDemoUser(newUser);

    return this.service.login(user);
  }

  @ApiExcludeEndpoint()
  @Get('/google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.service.googleLogin(req);
  }

  @ApiOperation({ summary: 'Login to Demo as a guest' })
  @Post('/guest/login')
  async guestLogin() {
    return this.service.guestLogin();
  }

  @ApiOperation({ summary: 'Register to Demo as a guest' })
  @Post('/guest/register')
  async guestRegister(
    @Headers('client_token') guestToken: string,
    @Body() body: DemoUserDto,
  ): Promise<LoginResponseDto> {
    body.id = this.service.decodeGuestToken(guestToken).toString();
    const user = await this.userService.createDemoUser(body);
    if (!user) {
      throw new BadRequestException('Registration failed');
    }

    return this.service.login(user);
  }

  @ApiOperation({
    summary:
      'Initiates a reset password flow on the Demo - sends user an email with a link to reset password',
  })
  @ApiResponse({
    status: 200,
    description: 'Reset password email sent',
  })
  @Post('/forgot-password')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.service.forgotPassword(dto.email);
  }

  @ApiOperation({
    summary:
      'Resets password - requires a valid token from the reset password email',
  })
  @ApiResponse({
    status: 200,
    description: 'Password successfully reset',
  })
  @Post('/reset-password')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<LoginResponseDto> {
    return this.service.resetPassword(dto);
  }
}
