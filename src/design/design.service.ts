import axios, { AxiosInstance } from 'axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Design } from './design.entity';
import { User } from '../user/user.entity';

@Injectable()
export class DesignService {
  private axiosInstance: AxiosInstance;

  constructor(
    @InjectRepository(Design)
    private readonly repo: Repository<Design>,
  ) {
    this.axiosInstance = axios.create({
      baseURL: process.env.API_URL,
      headers: {
        common: {
          'X-API-Key': process.env.API_KEY,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    });
  }

  public async checkAuth(id: string, userId: string) {
    const design = await this.repo.findOne({
      where: { id: Equal(id) },
    });
    if (!design || design.userId !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async getAllForUser(userId: string) {
    const { data } = await this.axiosInstance.get(`/designs`);
    const designIds = (await this.repo.findBy({ userId })).map(
      (design) => design.id,
    );
    const designsForUser = data.filter((design) =>
      designIds.find((id) => id === design.id),
    );
    return designsForUser;
  }

  async getOne(id: string): Promise<any> {
    const { data } = await this.axiosInstance.get(`/designs/${id}`);
    return data;
  }

  async create(dto: any, user: User): Promise<any> {
    const { data } = await this.axiosInstance.post('/designs', dto);
    const id = data?.id;
    const userId = user?.id;
    await this.repo.save({
      id,
      userId,
    });
    return data;
  }

  async patch(id: string, dto: any): Promise<any> {
    const { data } = await this.axiosInstance.patch(`/designs/${id}`, dto);
    return data;
  }

  async delete(id: string): Promise<any> {
    await this.axiosInstance.delete(`/designs/${id}`);
    return this.repo.delete({ id });
  }
}
