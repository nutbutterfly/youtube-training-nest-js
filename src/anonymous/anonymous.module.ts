import { Module } from '@nestjs/common';
import { AnonymousService } from './anonymous.service';
import { AnonymousController } from './anonymous.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AnonymousController],
  providers: [AnonymousService],
})
export class AnonymousModule {}
