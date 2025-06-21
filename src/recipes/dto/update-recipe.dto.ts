import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipeDto } from './create-recipe.dto';

export class UpdateUserDto extends PartialType(CreateRecipeDto) {}
