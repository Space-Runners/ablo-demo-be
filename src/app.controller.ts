import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiTags('Health')
  @ApiOperation({ summary: 'Health check' })
  @Public()
  @Get()
  getHealth(): string {
    return 'ok';
  }
}
