import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('verify')
  async verifyToken(@Body('token') token: string) {
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    return this.userService.verifyToken(token);
  }
}
