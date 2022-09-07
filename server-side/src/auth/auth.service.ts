import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor (
    private usersService: UsersService, 
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('未登録のユーザーです。');
    }

    if (user.password === password) {
      //spread演算子というらしい。
      const { password, ...result } = user;

      return result;
    } else {
      throw new UnauthorizedException('パスワードが一致しません。');
    }
  }

  async userRegistration(username: string, password: string): Promise<{ access_token: string }> {
    try {
      const newUser = await this.usersService.addNewUser(username, password);
      
      return this.login(newUser);
    } catch(err) {
      throw err;
    }
  }
  
  async login(user: {username: string, userId: number}): Promise<{ access_token: string }> {
    const payload = user;

    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
