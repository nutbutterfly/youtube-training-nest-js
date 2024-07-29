import { Test, TestingModule } from '@nestjs/testing';
import { AnonymousController } from './anonymous.controller';
import { AnonymousService } from './anonymous.service';

describe('AnonymousController', () => {
  let controller: AnonymousController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnonymousController],
      providers: [AnonymousService],
    }).compile();

    controller = module.get<AnonymousController>(AnonymousController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
