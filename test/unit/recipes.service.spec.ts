import { Test, TestingModule } from '@nestjs/testing';
import { RecipesRepository } from '../../src/recipes/recipes.repository';
import { RecipesService } from '../../src/recipes/recipes.service';

describe('RecipesService', () => {
  let service: RecipesService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: RecipesRepository;

  const mockRepo = {
    create: jest.fn(),
    fetchAll: jest.fn(),
    fetchAllWithFiltering: jest.fn(),
    addLikeRecipe: jest.fn(),
    fetchRecipeById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: RecipesRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    repository = module.get<RecipesRepository>(RecipesRepository);
  });

  it('should create recipe', async () => {
    const dto = { title: 'New', cookingTime: 20, ingredients: [] };
    const result = { id: 1, ...dto };
    mockRepo.create.mockResolvedValue(result);
    expect(await service.create(dto)).toEqual(result);
  });

  it('should return recipes with filters', async () => {
    const query = { page: 1, limit: 10 };
    const result = [{ id: 1, title: 'Test' }];
    mockRepo.fetchAllWithFiltering.mockResolvedValue(result);
    expect(await service.findAllRecipesWithFiltering(query)).toEqual(result);
  });

  it('should return liked recipe', async () => {
    const recipe = { id: 1, title: 'A' };
    mockRepo.fetchRecipeById.mockResolvedValue(recipe);
    mockRepo.addLikeRecipe.mockResolvedValue({ ...recipe, likes: 1 });
    const result = await service.addLikeRecipe(1);
    expect(result.likes).toBe(1);
  });
});
