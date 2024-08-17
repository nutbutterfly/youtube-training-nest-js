import { Test, TestingModule } from '@nestjs/testing';
import { AnonymousController } from './anonymous.controller';
import { AnonymousService } from './anonymous.service';
import { RegisterDto } from './dto/register.dto';

describe('AnonymousController', () => {
  let controller: AnonymousController;
  let service: AnonymousService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnonymousController],
      providers: [
        {
          provide: AnonymousService,
          useValue: {
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AnonymousController>(AnonymousController);
    service = module.get<AnonymousService>(AnonymousService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call AnonymousService.register with correct parameters', async () => {
      const dto: RegisterDto = { email: 'nat@ma-long-nest.com' };
      await controller.register(dto);
      expect(service.register).toHaveBeenCalledWith(dto);
    });

    it('should return the result from AnonymousService.register', async () => {
      const result = { email: 'nat@ma-long-nest.com' };
      jest.spyOn(service, 'register').mockResolvedValue(result);

      expect(await controller.register({} as RegisterDto)).toBe(result);
    });
  });
});