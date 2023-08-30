import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { DemoUserDto } from './demo-user.dto';
import { Roles } from '../auth/role.decorator';
import { RoleName } from '../auth/role-name.enum';
import { MailService } from '../mail/mail.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ClientGuard } from '../clients/client.guard';
import { User } from './user.entity';

@Controller()
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly service: UserService,
    private mailService: MailService,
  ) {}

  @ApiOperation({ summary: 'Get all users belonging to a Client' })
  @UseGuards(ClientGuard)
  @Get('/users')
  async getAllUsers(@Request() req): Promise<User[]> {
    return this.service.findAllByClient(req.client);
  }

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
