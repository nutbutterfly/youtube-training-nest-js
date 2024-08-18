import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ServiceUnavailableException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let userService: UserService;
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

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });


  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        email: 'nat@ma-long-nest.com',
        password: '1234',
        firstName: 'Nat',
        lastName: 'Live'
      }

      const user: User = new User();

      const savedUser: User = new User();
      savedUser.id = 1;
      savedUser.email = dto.email;
      savedUser.password = dto.password;
      savedUser.firstName = dto.firstName;
      savedUser.lastName = dto.lastName;

      jest.spyOn(userRepository, 'create').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);

      const result = await userService.create(dto);

      expect(result).toEqual(savedUser);
    });

    it('should fail when create a user', async () => {
      const dto: CreateUserDto = {
        email: 'nat@ma-long-nest.com',
        password: '1234',
        firstName: 'Nat',
        lastName: 'Live'
      }

      const user: User = new User();

      const savedUser: User = new User();
      savedUser.id = 1;
      savedUser.email = dto.email;
      savedUser.password = dto.password;
      savedUser.firstName = dto.firstName;
      savedUser.lastName = dto.lastName;

      jest.spyOn(userRepository, 'create').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockRejectedValue(new ServiceUnavailableException());

      await expect(userService.create(dto)).rejects.toThrow(ServiceUnavailableException);
    });

  });

  describe('findAll', () => {
    it('should return users', async () => {
      const users: User[] = [new User(), new User()];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await userService.findAll();

      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user: User = new User();
      user.id = 1;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

      const result = await userService.findOne(1);

      expect(result).toEqual(user);
      expect(userRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return a user', async () => {
      const user: User = new User();
      user.id = 1;
      user.email = 'nat@ma-long-nest.com';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

      const result = await userService.findByEmail('nat@ma-long-nest.com');

      expect(result).toEqual(user);
      expect(userRepository.findOneBy).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto: UpdateUserDto = {
        firstName: 'Nat Update',
        lastName: 'Live Update'
      }

      const user: User = new User();
      user.id = 1;
      user.email = 'nat@ma-long-nest.com';
      user.firstName = 'Nat';
      user.lastName = 'Live';

      const updatedUser: User = new User();
      updatedUser.id = 1;
      updatedUser.email = user.email;
      updatedUser.firstName = dto.firstName;
      updatedUser.lastName = dto.lastName;

      jest.spyOn(userRepository, 'findOneByOrFail').mockResolvedValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser);

      await userService.update(1, dto);

      expect(userRepository.findOneByOrFail).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should update a user', async () => {
      const dto: UpdateUserDto = {
        firstName: 'Nat Update',
        lastName: 'Live Update'
      }

      const user: User = new User();
      user.id = 1;
      user.email = 'nat@ma-long-nest.com';
      user.firstName = 'Nat';
      user.lastName = 'Live';

      jest.spyOn(userRepository, 'findOneByOrFail').mockRejectedValue(new ServiceUnavailableException());
      await userService.update(1, dto);
      expect(userRepository.findOneByOrFail).toHaveBeenCalled();
    });    
  });

});