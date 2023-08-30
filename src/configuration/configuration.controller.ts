import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigDto } from './config.dto';
import {
  ApiExcludeController,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Configuration } from './configuration.entity';

@Controller()
@ApiExcludeController()
@ApiTags('Configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @ApiOperation({ summary: 'Get all configurations' })
  @ApiResponse({
    status: 200,
    type: [Configuration],
  })
  @Get('/configuration')
  async getAll(): Promise<Configuration[]> {
    return this.configurationService.getAll();
  }

  @ApiOperation({ summary: 'Get single configuration' })
  @ApiResponse({
    status: 200,
    type: Configuration,
  })
  @Get('/configuration/:id')
  async getOne(id: number) {
    return this.configurationService.getOne(id);
  }

  @ApiOperation({ summary: 'Create new configuration' })
  @ApiResponse({
    status: 201,
    type: Configuration,
  })
  @Post('/configuration')
  async create(@Body() newConfig: ConfigDto) {
    return this.configurationService.create(newConfig);
  }

  @ApiOperation({ summary: 'Update existing configuration' })
  @ApiResponse({
    status: 200,
    type: Configuration,
  })
  @Patch('/configuration/:id')
  async update(id: number, @Body() newConfig: ConfigDto) {
    return this.configurationService.update(id, newConfig);
  }

  @ApiOperation({ summary: 'Delete existing configuration' })
  @ApiResponse({
    status: 200,
  })
  @Delete('/configuration/:id')
  async delete(id: number) {
    return this.configurationService.delete(id);
  }
}
