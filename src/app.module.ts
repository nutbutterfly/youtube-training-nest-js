import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { AnonymousModule } from './anonymous/anonymous.module';
import { UserModule } from './user/user.module';
import { AuthGuard } from './config/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync(
      {
        useClass: JwtConfig,
        global: true
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
