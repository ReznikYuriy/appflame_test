import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { GetRecipesDto } from './dto/get-recipe.dto';
import { RecipesRepository } from './recipes.repository';

@Injectable()
export class RecipesService {
  constructor(private readonly recipeRepository: RecipesRepository) {}
  async create(dto: CreateRecipeDto) {
    return this.recipeRepository.create(dto);
  }

  async findAllRecipes() {
    return this.recipeRepository.fetchAll();
  }

  async findAllRecipesWithFiltering(query: GetRecipesDto) {
    return this.recipeRepository.fetchAllWithFiltering(query);
  }

  async addLikeRecipe(id: number) {
    const recipe = await this.findRecipeById(id);
    if (!recipe) throw new NotFoundException('Not found.');
    return this.recipeRepository.addLikeRecipe(id);
  }

  async findRecipeById(id: number) {
    return this.recipeRepository.fetchRecipeById(id);
  }
}
