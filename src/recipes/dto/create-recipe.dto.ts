import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  cookingTime: number;

  @ApiProperty({
    required: true,
    type: [String],
    description: 'List of ingredients',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  ingredients: string[];
}
