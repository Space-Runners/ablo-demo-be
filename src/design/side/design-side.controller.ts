import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DesignService } from '../design.service';
import { DesignSideService } from './design-side.service';
import { ClientGuard } from '../../clients/client.guard';
import { CreateDesignSideDto } from './create-design-side.dto';
import { PatchDesignSideDto } from './patch-design-side.dto';

@Controller()
@ApiTags('Design Sides')
export class DesignSideController {
  constructor(
    private readonly service: DesignSideService,
    private readonly designService: DesignService,
  ) {}

  @ApiOperation({ summary: 'Get all design sides for a design' })
  @UseGuards(ClientGuard)
  @Get('/designs/:designId/sides')
  async getAll(@Request() req, @Param('designId') designId: string) {
    await this.designService.checkClientAuth(designId, req.client);
    return this.service.getAll(designId);
  }

  @ApiOperation({ summary: 'Get a design side' })
  @UseGuards(ClientGuard)
  @Get('/designs/:designId/sides/:id')
  async getOne(
    @Request() req,
    @Param('designId') designId: string,
    @Param('id') id: string,
  ) {
    await this.designService.checkClientAuth(designId, req.client);
    return this.service.getOne(id);
  }

  @ApiOperation({ summary: 'Create a design side' })
  @UseGuards(ClientGuard)
  @Post('/designs/:designId/sides')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Request() req,
    @Param('designId') designId: string,
    @Body() dto: CreateDesignSideDto,
  ) {
    await this.designService.checkClientAuth(designId, req.client);
    return this.service.create(dto, designId, req.client.id);
  }

  @ApiOperation({ summary: 'Patch a design side' })
  @UseGuards(ClientGuard)
  @Patch('/designs/:designId/sides/:id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async patch(
    @Request() req,
    @Param('designId') designId: string,
    @Param('id') id: string,
    @Body() dto: PatchDesignSideDto,
  ) {
    await this.designService.checkClientAuth(designId, req.client);
    return this.service.patch(dto, id, req.client.id);
  }

  @ApiOperation({ summary: 'Delete a design side' })
  @UseGuards(ClientGuard)
  @Delete('/designs/:designId/sides/:id')
  async delete(
    @Request() req,
    @Param('designId') designId: string,
    @Param('id') id: string,
  ) {
    await this.designService.checkClientAuth(designId, req.client);
    return this.service.delete(id);
  }
}
