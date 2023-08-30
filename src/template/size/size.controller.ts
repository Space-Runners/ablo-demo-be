import { Controller, Get, UseGuards } from '@nestjs/common';
import { SizeService } from './size.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientGuard } from '../../clients/client.guard';
import { Size } from './size.entity';

@Controller()
@ApiTags('Sizes')
export class SizeController {
  constructor(private readonly service: SizeService) {}

  @ApiOperation({ summary: 'Get all sizes' })
  @UseGuards(ClientGuard)
  @Get('/sizes')
  async findAll(): Promise<Size[]> {
    return this.service.findAll();
  }
}
