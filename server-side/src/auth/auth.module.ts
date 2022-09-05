import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { jwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule, 
    PassportModule, 
    JwtModule.register({
      secret: jwtConstants.secret, //本番環境では注意
      signOptions: { expiresIn: '60s' }
    })
  ], 
  providers: [
    AuthService, 
    LocalStrategy, 
    jwtStrategy
  ], 
  exports: [
    AuthService
  ]
})
export class AuthModule {}
