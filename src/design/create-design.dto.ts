import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDesignDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  templateColorId: string;

  @IsNotEmpty()
  @IsNumber()
  sizeId: number;

  @IsNotEmpty()
  templateId: string;
}
