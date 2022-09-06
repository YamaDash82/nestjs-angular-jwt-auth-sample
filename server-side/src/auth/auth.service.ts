import { Injectable } from '@nestjs/common';
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
      throw new Error('未登録のユーザーです。');
    }

    if (user.password === password) {
      //spread演算子というらしい。
      const { password, ...result } = user;

      return result;
    } else {
      throw new Error('パスワードが一致しません。');
    }
  }

  async login(user: {username: string, userId: number}) {
    const payload = user;

    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
