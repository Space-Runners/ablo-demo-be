import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateImageDto {
  @ApiProperty({
    description: 'Style for the image generation',
    example: 'Kidult',
  })
  @IsNotEmpty()
  @IsString()
  style: string;

  @ApiProperty({
    description: 'Free text input from the end user',
    example: 'Nice picture',
  })
  @IsNotEmpty()
  @IsString()
  freeText: string;

  @ApiProperty({
    description: 'Style for the image generation',
    example: `['Kidult']`,
  })
  subjectSuggestions: string[];

  @ApiProperty({
    description: 'Mood for the image generation',
    example: 'red_mood',
  })
  @IsString()
  tone?: string;

  @ApiProperty({
    description: 'Background or not',
  })
  background?: boolean;
}
