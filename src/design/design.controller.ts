import {
  Body,
  Controller,
  Delete,
  Get,
  Request,
  Post,
  Param,
  Put,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { DesignService } from './design.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Design } from './design.entity';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller()
@ApiTags('Design')
export class DesignController {
  constructor(private readonly service: DesignService) {}

  @ApiOperation({ summary: 'Get all designs for user' })
  @ApiResponse({
    status: 200,
  })
  @Get('/designs')
  @UseGuards(JwtAuthGuard)
  async getAll(@Request() req): Promise<Design[]> {
    const designs = await this.service.getAllForUser(req.user.id);
    return designs;
  }

  @ApiOperation({ summary: 'Get single design' })
  @ApiResponse({
    status: 200,
  })
  @Get('/designs/:id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id') id: string, @Request() req) {
    const design = await this.service.getUserDesign(id, req.user.id);
    return design;
  }

  @ApiOperation({ summary: 'Create a new design as a Demo User' })
  @ApiResponse({
    status: 201,
  })
  @Post('/designs')
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() design: any): Promise<Design> {
    return this.service.create(design, req.user);
  }

  @ApiOperation({ summary: 'Create a new design as a Client' })
  @ApiResponse({
    status: 201,
  })
  @Post('/clients/designs')
  @UseGuards(JwtAuthGuard)
  async clientCreate(@Request() req, @Body() design: any): Promise<Design> {
    return this.service.create(design, req.user);
  }

  @ApiOperation({ summary: 'Patch design' })
  @ApiResponse({
    status: 204,
  })
  @Patch('/designs/:id')
  @UseGuards(JwtAuthGuard)
  async patch(
    @Param('id') id: string,
    @Request() req,
    @Body() patchDesignDto: any,
  ): Promise<Design> {
    const design = await this.service.getOne(id);
    await this.service.patch(design, patchDesignDto);
    return design;
  }

  @ApiOperation({ summary: 'Update design' })
  @ApiResponse({
    status: 204,
  })
  @Put('/designs/:id')
  @UseGuards(JwtAuthGuard)
  async put(
    @Param('id') id: string,
    @Request() req,
    @Body() design: any,
  ): Promise<Design> {
    await this.service.getUserDesign(id, req.user.id);
    await this.service.update(id, design);
    return;
  }

  @ApiOperation({ summary: 'Delete design' })
  @ApiResponse({
    status: 204,
  })
  @Delete('/designs/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Request() req): Promise<void> {
    await this.service.getUserDesign(id, req.user.id);
    return this.service.delete(id);
  }
}
