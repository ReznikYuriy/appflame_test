/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Recipe } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { recipeDto } from './mocked.data';

describe('RecipesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;
  let recipeId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get(PrismaService);

    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: process.env.DEFAULT_ADMIN_EMAIL,
      password: process.env.DEFAULT_ADMIN_PASSWORD,
    });

    const { access_token }: { access_token: string } = res.body;
    jwtToken = access_token;
  });

  afterAll(async () => {
    await prisma.recipe.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('/recipes (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/recipes?page=1&limit=10')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/recipes (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/recipes')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(recipeDto)
      .expect(201);

    recipeId = (response.body as Recipe).id;

    expect(response.body).toEqual(
      expect.objectContaining({
        title: recipeDto.title,
        description: recipeDto.description,
        cookingTime: recipeDto.cookingTime,
        ingredients: expect.arrayContaining(recipeDto.ingredients),
      }),
    );
  });

  it('/recipes/:id/like (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/recipes/${recipeId}/like`)
      .expect(200);

    expect((response.body as Recipe).likes).toBe(1);
  });
});
