import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetRecipesDto {
  @ApiProperty({ required: false, type: Number, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, type: Number, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  maxCookingTime?: number;

  @ApiProperty({ required: false, type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  minIngredients?: number;
}
