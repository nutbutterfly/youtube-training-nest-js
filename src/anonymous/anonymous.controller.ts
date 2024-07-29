import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnonymousService } from './anonymous.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/config/public.decorator';

@Controller('anonymous')
export class AnonymousController {
  constructor(private readonly anonymousService: AnonymousService) {}

  @Public()
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.anonymousService.register(dto);
  }

  @Public()
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.anonymousService.login(dto);
  }
  
}