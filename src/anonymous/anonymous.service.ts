import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AnonymousService {

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService
  ) { }

  async register(dto: RegisterDto) {
    // genereate password 8 characters
    const password = Math.random().toString(36).slice(-8);

    const user = await this.userService.create({
      email: dto.email,
      password: password,
      fistName: null,
      lastName: null
    });

    return {
      email: user.email
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    // compare password
    const isMatched = await this.userService.matchPassword(dto.password, user.password);
    if (isMatched === false) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      email: user.email
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token
    }
  }

}