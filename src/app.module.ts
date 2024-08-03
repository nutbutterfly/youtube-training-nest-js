import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { AnonymousModule } from './anonymous/anonymous.module';
import { UserModule } from './user/user.module';
import { AuthGuard } from './config/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true
      }
    ),
    JwtModule.registerAsync(
      {
        useClass: JwtConfig,
        global: true
      }
    ),
    TypeOrmModule.forRootAsync(
      {
        useClass: TypeOrmConfig
      }
    ),
    AnonymousModule,
    UserModule
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    }
  ],
})
export class AppModule { }
