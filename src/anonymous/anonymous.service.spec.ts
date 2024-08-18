import { Test, TestingModule } from '@nestjs/testing';
import { AnonymousService } from './anonymous.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AnonymousService', () => {
  let jwtService: JwtService;
  let userService: UserService;
  let anonymousService: AnonymousService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnonymousService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn()
          }
        },
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            matchPassword: jest.fn()
          }
        }
      ],
    }).compile();

    anonymousService = module.get<AnonymousService>(AnonymousService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(anonymousService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('register', () => {
    it('should register if valid payload', async () => {
      const dto: RegisterDto = {
        email: 'nat@ma-long-nest.com',
      }

      const user: User = {
        id: 1,
        email: dto.email,
        password: 'someHashedPassword',
        firstName: 'Nat',
        lastName: 'Live',
        isActive: true
      }

      jest.spyOn(userService, 'create').mockResolvedValue(user);

      const response = await anonymousService.register(dto);

      expect(userService.create).toHaveBeenCalled();

      expect(response).toEqual({
        email: dto.email
      })
    });
  });

  describe('login', () => {
    it('should throw error if invalid email', async () => {
      const dto: LoginDto = {
        email: 'nat99@ma-long-nest.com',
        password: '12345678'
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      await expect(anonymousService.login(dto)).rejects.toThrow(UnauthorizedException);

      expect(userService.findByEmail).toHaveBeenCalled();
    });

    it('should throw error if password is invalid', async () => {
      const dto: LoginDto = {
        email: 'nat@ma-long-nest.com',
        password: '1234567890'
      };

      const user: User = {
        id: 1,
        email: dto.email,
        password: '1234',
        firstName: 'Nat',
        lastName: 'Live',
        isActive: true
      }      

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(userService, 'matchPassword').mockResolvedValue(false);

      await expect(anonymousService.login(dto)).rejects.toThrow(UnauthorizedException);

      expect(userService.findByEmail).toHaveBeenCalled();
      expect(userService.matchPassword).toHaveBeenCalled();
    });

    it('should login success and return access token', async () => {
      const dto: LoginDto = {
        email: 'nat@ma-long-nest.com',
        password: '1234'
      };

      const user: User = {
        id: 1,
        email: dto.email,
        password: '1234',
        firstName: 'Nat',
        lastName: 'Live',
        isActive: true
      }

      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoibmF0QG1hLWxvbmcubmVzdCIsImlhdCI6MTYxNjIzOTAyMn0.7J9';

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(userService, 'matchPassword').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const response = await anonymousService.login(dto);

      expect(userService.findByEmail).toHaveBeenCalled();
      expect(userService.matchPassword).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalled();

      expect(response).toEqual({
        access_token: token,
      });

    });
  });  

});