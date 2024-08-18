import { Test, TestingModule } from '@nestjs/testing';
import { AnonymousController } from './anonymous.controller';
import { AnonymousService } from './anonymous.service';

describe('AnonymousController', () => {
  let anonymousService: AnonymousService;
  let anonymouseController: AnonymousController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnonymousController],
      providers: [
        AnonymousService,
        {
          provide: AnonymousService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          }
        }
      ],
    }).compile();

    anonymouseController = module.get<AnonymousController>(AnonymousController);
    anonymousService = module.get<AnonymousService>(AnonymousService);
  });

  it('should be defined', () => {
    expect(anonymouseController).toBeDefined();
    expect(anonymousService).toBeDefined();
  });

});