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
import { CreateDesignSideDto } from './create-design-side.dto';
import { PatchDesignSideDto } from './patch-design-side.dto';
import { JwtAuthGuard } from '../../auth/jwt.guard';

@Controller()
@ApiTags('Design Sides')
export class DesignSideController {
  constructor(
    private readonly service: DesignSideService,
    private readonly designService: DesignService,
  ) {}

  @ApiOperation({ summary: 'Get all design sides for a design' })
  @UseGuards(JwtAuthGuard)
  @Get('/designs/:designId/sides')
  async getAll(@Request() req, @Param('designId') designId: string) {
    return this.service.getAll(designId);
  }

  @ApiOperation({ summary: 'Get a design side' })
  @UseGuards(JwtAuthGuard)
  @Get('/designs/:designId/sides/:id')
  async getOne(
    @Request() req,
    @Param('designId') designId: string,
    @Param('id') id: string,
  ) {
    return this.service.getOne(id);
  }

  @ApiOperation({ summary: 'Create a design side' })
  @UseGuards(JwtAuthGuard)
  @Post('/designs/:designId/sides')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Request() req,
    @Param('designId') designId: string,
    @Body() dto: CreateDesignSideDto,
  ) {
    return this.service.create(dto, designId, req.client.id);
  }

  @ApiOperation({ summary: 'Patch a design side' })
  @UseGuards(JwtAuthGuard)
  @Patch('/designs/:designId/sides/:id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async patch(
    @Request() req,
    @Param('designId') designId: string,
    @Param('id') id: string,
    @Body() dto: PatchDesignSideDto,
  ) {
    return this.service.patch(dto, id, req.client.id);
  }

  @ApiOperation({ summary: 'Delete a design side' })
  @UseGuards(JwtAuthGuard)
  @Delete('/designs/:designId/sides/:id')
  async delete(
    @Request() req,
    @Param('designId') designId: string,
    @Param('id') id: string,
  ) {
    return this.service.delete(id);
  }
}
