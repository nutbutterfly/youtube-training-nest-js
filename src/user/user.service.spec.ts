import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };
      const user = new User();
      user.email = dto.email;
      user.password = 'hashedPassword';

      jest.spyOn(service, 'hashPassword').mockResolvedValue('hashedPassword');
      jest.spyOn(userRepository, 'create').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      expect(await service.create(dto)).toEqual(user);
    });

    it('should throw an error if saving fails', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };
      const user = new User();
      user.email = dto.email;
      user.password = 'hashedPassword';

      jest.spyOn(service, 'hashPassword').mockResolvedValue('hashedPassword');
      jest.spyOn(userRepository, 'create').mockReturnValue(user);
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValue(new Error('Save failed'));

      await expect(service.create(dto)).rejects.toThrow('Save failed');
    });
  });
});
