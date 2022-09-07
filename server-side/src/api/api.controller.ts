import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api')
export class ApiController {
  @UseGuards(JwtAuthGuard)
  @Get('hoge')
  hoge(): string {
    return 'hoge';
  }
}
