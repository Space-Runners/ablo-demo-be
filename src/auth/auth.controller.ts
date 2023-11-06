import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GoogleOAuthGuard } from './google-auth.guard';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from '../user/user.dto';
import { UserService } from '../user/user.service';
import { faker } from '@faker-js/faker';
import { SocialLogin } from './social-login.enum';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { VerifyPasswordDto } from './dtos/verify-password.dto';
import { GoogleDto } from './dtos/google.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private service: AuthService,
    private userService: UserService,
  ) {}

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
  async register(@Body() dto: UserDto): Promise<LoginResponseDto> {
    await this.userService.create(dto);

    return this.service.login({ email: dto.email, password: dto.password });
  }

  @ApiOperation({ summary: 'Google login to demo' })
  @ApiResponse({
    status: 200,
    description: 'Google login successful',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Post('/google/login')
  async googleAuth(@Body() dto: GoogleDto): Promise<LoginResponseDto> {
    const googleUser = await this.service.googleLogin(dto.token);

    const existingUser = await this.userService.findOneByEmail(
      googleUser.email,
    );

    if (existingUser) {
      if (!existingUser.socialLogin || !existingUser.socialId) {
        existingUser.socialId = googleUser.sub;
        existingUser.socialLogin = SocialLogin.GOOGLE;
        await existingUser.save();
      }
      return this.service.login(existingUser, true);
    }

    const newUser: UserDto = {
      email: googleUser.email,
      firstName: googleUser.given_name,
      lastName: googleUser.family_name,
      password: faker.internet.password(),
      socialLogin: SocialLogin.GOOGLE,
      socialId: googleUser.sub,
    };

    const user = await this.userService.create(newUser);

    return this.service.login(user);
  }

  @ApiExcludeEndpoint()
  @Get('/google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.service.googleLogin(req);
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

  @ApiOperation({ summary: 'Verify password on password wall' })
  @ApiResponse({
    status: 200,
    description: 'Password verified',
  })
  @Post('/verify-password')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  verifyPassword(@Body() dto: VerifyPasswordDto) {
    this.service.verifyPassword(dto);
  }
}
