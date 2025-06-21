import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { CreateRecipeDto } from './create-recipe.dto';

export class OutputRecipeDto extends CreateRecipeDto {
  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsInt()
  likes: number;
}
