import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should call userService.create with correct parameters', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com', password: 'password', firstName: 'John', lastName: 'Doe' };
      const result = { id: 1, isActive: true, ...createUserDto };

      jest.spyOn(userService, 'create').mockResolvedValue(result);

      expect(await controller.create(createUserDto)).toBe(result);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should call userService.findAll and return the result', async () => {
      const result = [{ id: 1, email: 'test@example.com', password: 'password', firstName: 'John', lastName: 'Doe', isActive: true }];

      jest.spyOn(userService, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });
});