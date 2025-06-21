import { Injectable } from '@nestjs/common';
import { Prisma, Recipe } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { GetRecipesDto } from './dto/get-recipe.dto';
@Injectable()
export class RecipesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRecipeDto) {
    return this.prisma.recipe.create({
      data: dto,
    });
  }

  async fetchAll(): Promise<Recipe[] | null> {
    return this.prisma.recipe.findMany({});
  }

  async fetchAllWithFiltering({
    page = 1,
    limit = 10,
    search,
    maxCookingTime,
    minIngredients,
  }: GetRecipesDto): Promise<Recipe[]> {
    const offset = (page - 1) * limit;
    const whereParts: Prisma.Sql[] = [];

    if (search) {
      whereParts.push(
        Prisma.sql`("title" ILIKE ${'%' + search + '%'} OR "description" ILIKE ${'%' + search + '%'})`,
      );
    }
    if (maxCookingTime !== undefined) {
      whereParts.push(Prisma.sql`"cookingTime" <= ${maxCookingTime}`);
    }
    if (minIngredients !== undefined) {
      whereParts.push(
        Prisma.sql`cardinality("ingredients") >= ${minIngredients}`,
      );
    }

    const whereClause =
      whereParts.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(whereParts, ` AND `)}`
        : Prisma.empty;

    const query = Prisma.sql`
    SELECT * FROM "Recipe"
    ${whereClause}
    ORDER BY "id"
    LIMIT ${limit} OFFSET ${offset};`;

    return this.prisma.$queryRaw<Recipe[]>(query);
  }

  async fetchRecipeById(id: number): Promise<Recipe | null> {
    return this.prisma.recipe.findFirst({
      where: { id },
    });
  }

  async addLikeRecipe(id: number): Promise<Recipe> {
    return this.prisma.recipe.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
  }
}
