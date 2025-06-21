import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { GetRecipesDto } from './dto/get-recipe.dto';
import { OutputRecipeDto } from './dto/output-recipe.dto';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiOperation({ summary: 'Get recipes' })
  @ApiResponse({ status: 200, type: [OutputRecipeDto] })
  @Get()
  async getAllRecipes(@Query() query: GetRecipesDto) {
    return this.recipesService.findAllRecipesWithFiltering(query);
  }

  @ApiOperation({ summary: 'Add like to recipe' })
  @ApiResponse({ status: 200, type: OutputRecipeDto })
  @Patch(':id/like')
  async likeRecipe(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.addLikeRecipe(id);
  }

  @ApiOperation({ summary: 'Create recipe' })
  @ApiResponse({ status: 201, type: OutputRecipeDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createRecipe(@Body() dto: CreateRecipeDto) {
    return this.recipesService.create(dto);
  }
}
