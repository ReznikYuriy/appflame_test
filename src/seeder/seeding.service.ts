import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecipesService } from 'src/recipes/recipes.service';
import { UsersService } from 'src/users/users.service';
import { mockedRecipes } from './recipes.data';

@Injectable()
export class SeedingService {
  private readonly logger = new Logger(SeedingService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly recipeService: RecipesService,
    private readonly configService: ConfigService,
  ) {}

  async runSeeders() {
    await this.seedAdmin();
    await this.seedRecipes();
  }

  private async seedAdmin() {
    const adminEmail = this.configService.get<string>('DEFAULT_ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>(
      'DEFAULT_ADMIN_PASSWORD',
    );
    if (!adminEmail || !adminPassword) return;
    const existing = await this.userService.findOneByEmail(adminEmail);

    if (existing) {
      this.logger.log('Default admin user already exists');
      return;
    }

    await this.userService.create({
      email: adminEmail,
      password: adminPassword,
    });

    this.logger.log('Default admin user created');
  }

  private async seedRecipes() {
    const createdRecipes = await this.recipeService.findAllRecipes();
    if (createdRecipes?.length) {
      this.logger.log('Recipes already seeded');
      return;
    }

    await Promise.all(
      mockedRecipes.map((recipe) => this.recipeService.create(recipe)),
    );

    this.logger.log(`${mockedRecipes.length} recipes seeded`);
  }
}
