import { HttpException, Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { Client } from './client.entity';
import { ApiKey } from './api-key.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from './create-client.dto';
import { randomBytes } from 'crypto';
import { HttpStatusCode } from 'axios';
import { RoleName } from '../auth/role-name.enum';
import { User } from '../user/user.entity';
import { DeleteClientDto } from './delete-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly repo: Repository<Client>,
    @InjectRepository(ApiKey)
    private readonly apiKeyRepo: Repository<ApiKey>,
  ) {}

  async create(user: User, clientDto: CreateClientDto) {
    // First check for existing client
    const existingClient = await this.repo.findOneBy({
      name: clientDto.name,
    });

    const client = new Client();
    client.domain = clientDto.domain;
    client.name = clientDto.name;

    if (existingClient) {
      throw new HttpException('Client already exists', HttpStatusCode.Conflict);
    }

    // If user is not a super admin, they can only create clients for themselves
    if (!user.roles.find((role) => role.name === RoleName.SuperAdmin)) {
      // First check if user already has a client
      if (user.client) {
        throw new HttpException(
          'User already has a client',
          HttpStatusCode.Conflict,
        );
      }

      client.users = [user];
    }

    await this.repo.save(client);
    client.apiKey = await this.createApiKey(client.id);

    return client;
  }

  async delete(deleteClientDto: DeleteClientDto) {
    const client = await this.repo.findOneBy({ name: deleteClientDto.name });

    if (!client) {
      throw new HttpException('Client not found', HttpStatusCode.NotFound);
    }

    await this.repo.delete({ id: client.id });
  }

  static generateApiKey(): string {
    return randomBytes(32).toString('hex');
  }

  async createApiKey(clientId: string): Promise<ApiKey> {
    const key = ClientService.generateApiKey();
    const apiKey = await this.apiKeyRepo.save({
      clientId,
      key,
    });

    return apiKey;
  }

  async findOne(findOneOptions: FindOneOptions): Promise<Client> {
    return this.repo.findOne(findOneOptions);
  }

  async getClientToken(clientId: string): Promise<ApiKey> {
    return this.apiKeyRepo.findOneBy({ clientId });
  }

  async getApiKey(token: string): Promise<ApiKey> {
    return this.apiKeyRepo.findOneBy({ key: token });
  }

  async getClients(): Promise<Client[]> {
    const clients = await this.repo.find({ order: { name: 'ASC' } });
    return clients;
  }

  async checkClientToken(clientId: string, token: string): Promise<boolean> {
    const clientToken = await this.apiKeyRepo.findOneBy({
      clientId,
      key: token,
    });

    return !!clientToken;
  }

  async getClientByApiKey(token: string): Promise<Client> {
    const clientToken = await this.apiKeyRepo.findOneBy({
      key: token,
    });

    return this.repo.findOneBy({ id: clientToken.clientId });
  }

  async blockClient(clientId: string) {
    return this.repo.update({ id: clientId }, { isActive: false });
  }

  async unblockClient(clientId: string) {
    return this.repo.update({ id: clientId }, { isActive: true });
  }

  async deleteClientToken(clientId: string) {
    return this.apiKeyRepo.delete({ clientId });
  }
}
