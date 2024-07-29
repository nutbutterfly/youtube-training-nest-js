import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AnonymousService {

  constructor(
    private jwtService: JwtService
  ) { }

  register(dto: RegisterDto) {
    return 'This action will register';
  }

  login(dto: LoginDto) {
    // TODO: replace this mock user with DB query
    const mockUser = {
      id: 1,
      email: 'nat@ma-long-nest.com',
      password: '1234'
    };

    if (dto.email !== mockUser.email || dto.password !== mockUser.password) {
      return 'Invalid credentials';
    }

    const payload = {
      sub: mockUser.id,
      email: mockUser.email
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token
    }
  }

}