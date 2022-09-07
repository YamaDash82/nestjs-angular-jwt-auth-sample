import { Injectable, UnauthorizedException } from '@nestjs/common';

export interface User {
  userId: number;
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1, 
      username: `Taro`, 
      password: `pass1`
    }, 
    { 
      userId: 2, 
      username: `Hanako`, 
      password: 'pass2'
    }, 
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => {
      return user.username === username
    });
  }

  //新規ユーザー登録処理
  async addNewUser(username: string, password: string): Promise<{userId: number, username: string}> {
    //ユーザー名が既に登録されていないか確認する。
    if (this.users.findIndex(user => { return user.username === username}) >= 0) {
      //既に登録済のユーザーである。
      throw new UnauthorizedException('既に登録済のユーザーです。');
    }

    //ユーザー一覧に追加する。
    const userId = this.users.length + 1;
    this.users.push({ userId: userId, username: username, password: password });

    return { userId, username };
  }
}
