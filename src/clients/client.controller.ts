import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './create-client.dto';
import { Public } from '../auth/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Client } from './client.entity';
import { User } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RoleName } from '../auth/role-name.enum';
import { Roles } from '../auth/role.decorator';
import { DeleteClientDto } from './delete-client.dto';
import { RoleGuard } from '../auth/role.guard';

@Public()
@Controller('clients')
@ApiTags('Clients')
export class ClientController {
  constructor(private readonly service: ClientService) {}

  @ApiOperation({ summary: 'Create a new client' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createClient(
    @Req() req,
    @Body() newClient: CreateClientDto,
  ): Promise<Client> {
    const user: User = req.user;
    const client = await this.service.create(user, newClient);

    return client;
  }

  @ApiOperation({ summary: 'Deletes a client - super admins only' })
  @UseGuards(RoleGuard)
  @Delete()
  @Roles(RoleName.SuperAdmin)
  async delete(@Body() deleteClientDto: DeleteClientDto): Promise<void> {
    await this.service.delete(deleteClientDto);
  }

  @ApiOperation({ summary: 'Gets all clients' })
  @Get()
  async getClients(): Promise<Client[]> {
    const clients = await this.service.getClients();

    return clients;
  }
}
