import axios, { AxiosInstance } from 'axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class DesignService {
  private axiosInstance: AxiosInstance;

  constructor() {
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
    const res = await this.axiosInstance.get(`/designs/${id}`);
    if (!res.data || res.data.externalUserId !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return res.data;
  }

  async getAllForUser(userId: string) {
    const { data } = await this.axiosInstance.get(
      `/designs/client?externalUserId=${userId}`,
    );
    return data;
  }

  async getOne(id: string): Promise<any> {
    return (await this.axiosInstance.get(`/designs/${id}`))?.data;
  }

  async create(dto: any): Promise<any> {
    const { data } = await this.axiosInstance.post('/designs', dto);
    return data;
  }

  async createFull(dto: any): Promise<any> {
    const { data } = await this.axiosInstance.post('/designs/full', dto);
    return data;
  }

  async patch(id: string, dto: any): Promise<any> {
    const { data } = await this.axiosInstance.patch(`/designs/${id}`, dto);
    return data;
  }

  async delete(id: string): Promise<any> {
    return await this.axiosInstance.delete(`/designs/${id}`);
  }
}
