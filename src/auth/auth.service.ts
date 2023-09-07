import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { User } from '../user/user.entity';
import { IJwtPayload } from './jwt-payload.interface';
import { ResetToken } from '../user/reset-token.entity';
import { MailService } from '../mail/mail.service';
import { EmailTemplate } from '../mail/templates.enum';
import { ResetPasswordDto } from './reset-password.dto';
import { LoginResponseDto } from './login-response.dto';
import { Equal } from 'typeorm';

@Injectable()
export class AuthService {
  googleClient: OAuth2Client;
  static GUEST_EMAIL = 'guest@ablo.ai';
  static RESET_TOKEN_TIMEOUT_MINUTES = 30;
  static MIN_PASSWORD_LENGTH = 8;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
    );
  }

  async forgotPassword(
    email: string,
    url = process.env.DEMO_URL,
  ): Promise<ResetToken> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return;
    }

    // Check for existing token
    const existingToken = await ResetToken.findOne({
      where: { user: Equal(user.id) },
    });

    if (existingToken) {
      await existingToken.remove();
    }

    const resetToken = new ResetToken();
    resetToken.user = user;
    resetToken.token = v4();
    resetToken.expiresAt = new Date(
      Date.now() + AuthService.RESET_TOKEN_TIMEOUT_MINUTES * 60 * 1000, // 30 minutes
    );
    await resetToken.save();

    // Send email
    const resetUrl = `${url}/reset-password?token=${resetToken.token}`;

    await this.mailService.send(email, EmailTemplate.GENERIC, {
      subject: 'Reset your Ablo password',
      title: 'Reset your Ablo password',
      body: `Click the button below to reset your password. This link will expire in ${AuthService.RESET_TOKEN_TIMEOUT_MINUTES} minutes.`,
      buttonText: 'Reset Password',
      buttonUrl: resetUrl,
    });

    return resetToken;
  }

  async resetPassword(dto: ResetPasswordDto): Promise<LoginResponseDto> {
    const resetToken = await ResetToken.findOne({
      where: { token: dto.token },
      relations: ['user'],
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid token');
    }

    if (resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Token expired');
    }

    const user = resetToken.user;

    user.password = await argon2.hash(dto.password);

    await user.save();
    await resetToken.remove();

    return this.login({ email: user.email, password: dto.password });
  }

  async validateUser(
    email: string,
    pass: string,
    isFromGoogle = false,
  ): Promise<User> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (user.socialLogin && isFromGoogle) {
      return user;
    }

    const isVerified = await argon2.verify(user.password, pass);
    if (!isVerified) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  generateJwt(payload: IJwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });
  }

  async login(
    login: LoginDto,
    isFromGoogle = false,
  ): Promise<LoginResponseDto> {
    const user = await this.validateUser(
      login.email,
      login.password,
      isFromGoogle,
    );

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload: IJwtPayload = {
      email: user.email,
      id: user.id,
      roles: user.roles.map((role) => role.name),
    };

    return {
      access_token: this.generateJwt(payload),
      user,
    };
  }

  async googleLogin(token: string): Promise<TokenPayload> {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: this.configService.get('GOOGLE_CLIENT_ID'),
    });

    return ticket.getPayload();
  }

  async guestLogin() {
    const payload = {
      email: 'guest@ablo.ai',
      id: v4(),
      roles: ['guest'],
    };

    return {
      access_token: this.generateJwt(payload),
    };
  }

  decodeGuestToken(token: string) {
    if (!token) {
      throw new BadRequestException('Invalid token');
    }
    return this.jwtService.decode(token) || '';
  }
}
