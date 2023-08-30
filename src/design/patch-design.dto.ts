import { IsString, IsNumber } from 'class-validator';

export class PatchDesignDto {
  @IsString()
  name?: string;

  templateColorId?: string;

  @IsNumber()
  sizeId?: number;

  templateId?: string;
}
