import { Controller, Param, Get } from '@nestjs/common';
import { NewUserService } from './user.service';
import { UserDetails } from './user-details.interface';

@Controller('user')
export class NewUserController {
  constructor(private newUserService: NewUserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserDetails | null> {
    return this.newUserService.findById(id);
  }
}
