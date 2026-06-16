import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { JwtStrategy } from './application/jwt.strategy';
import { RefreshStrategy } from './application/refresh.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshStrategy,
  ],
})
export class IamModule {}