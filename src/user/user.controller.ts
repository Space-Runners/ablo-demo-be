import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller()
@ApiTags('Users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({ summary: 'Verify email with token' })
  @Get('/users/verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    await this.service.verifyEmail(token);
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
