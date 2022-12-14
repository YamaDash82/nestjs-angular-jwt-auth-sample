import { Controller, Request, Get, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    console.log(`auth/login:${JSON.stringify(req.user)}`);
    return this.authService.login(req.user);
  }

  @Post('user-registration')
  async userRegistration(@Body() body: { username: string, password: string }) {
    console.log(`body:${JSON.stringify(body)}`);

    return this.authService.userRegistration(body.username, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-login') 
  checkLogin(@Request() req) {
    console.log(`check-login:${JSON.stringify(req.user)}`);

    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(`profile着信:${JSON.stringify(req.user)}`);
    return req.user;
  }
}
