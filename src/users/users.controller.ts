import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './users.service';
import { UserDetails } from './user-details.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserDetails | null> {
    return this.userService.findbyId(id);
  }
}
