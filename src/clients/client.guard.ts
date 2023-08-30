import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientService } from './client.service';

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(private readonly clientsService: ClientService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key missing.');
    }

    const client = await this.clientsService.getClientByApiKey(apiKey);

    if (!client) {
      throw new UnauthorizedException('Invalid API key.');
    }

    request.client = client;

    return true;
  }
}
