import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { MailService } from '../mail/mail.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller()
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly service: UserService,
    private mailService: MailService,
  ) {}

  @ApiOperation({ summary: 'Verify email with token' })
  @Get('/users/verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    const user = await this.service.verifyEmail(token);
    await this.mailService.sendWelcomeEmail(user.email, user.firstName);
  }

  @ApiOperation({
    summary: 'Get currently logged in user',
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
