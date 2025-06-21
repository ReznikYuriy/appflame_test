import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesRepository } from './recipes.repository';
import { RecipesService } from './recipes.service';

@Module({
  imports: [],
  providers: [RecipesService, RecipesRepository],
  controllers: [RecipesController],
  exports: [RecipesService],
})
export class RecipesModule {}
