import { Injectable } from '@nestjs/common';

export interface User {
  userId: number;
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 2, 
      username: `Denjiman`, 
      password: `denshisentai`
    }, 
    { 
      userId: 3, 
      username: `Sunvulcan`, 
      password: 'taiyosentai'
    }, 
    {
      userId: 4, 
      username: `GogleFive`, 
      password: `daisentai`
    }
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => {
      return user.username === username
    });
  }
}
