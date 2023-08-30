import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientGuard } from '../../clients/client.guard';
import { Currency } from './currency.entity';

@Controller()
@ApiTags('Currencies')
export class CurrencyController {
  constructor(private readonly service: CurrencyService) {}

  @ApiOperation({ summary: 'Get all currencies' })
  @UseGuards(ClientGuard)
  @Get('/currencies')
  async findAll(): Promise<Currency[]> {
    return this.service.findAll();
  }
}
