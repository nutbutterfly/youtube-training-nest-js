import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async matchPassword(
    rawPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(rawPassword, hashedPassword);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create();
    user.email = dto.email;
    user.password = await this.hashPassword(dto.password);

    try {
      return this.userRepository.save(user);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  findAll() {
    const option: FindManyOptions<User> = {
      where: {
        isActive: true,
      },
    };

    return this.userRepository.find(option);
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  update(id: number, dto: UpdateUserDto) {
    this.userRepository
      .findOneByOrFail({ id })
      .then((user) => {
        // update
        user.firstName = dto.firstName;
        user.lastName = dto.lastName;

        this.userRepository.save(user);
      })
      .catch((error) => {
        Logger.error(error);
      });
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }
}
