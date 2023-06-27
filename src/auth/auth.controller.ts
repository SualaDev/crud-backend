import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { NewUserDTO } from 'src/users/dtos/new-user.dto';
import { UserDetails } from 'src/users/user-details.interface';
import { CurrentUserDTO } from 'src/users/dtos/existing-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('register')
  register(@Body() user: NewUserDTO): Promise<UserDetails | null> {
    return this.authService.registerUser(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: CurrentUserDTO): Promise<{ token: string } | null> {
    return this.authService.loginUser(user);
  }
}
