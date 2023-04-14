import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/users.schema';
import { Model } from 'mongoose';
import { NewUserDTO } from 'src/users/dto/new-user.dto';
import { UserDetails } from 'src/users/user-details.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async register(user: NewUserDTO): Promise<UserDetails | any> {
    const { name, email, password } = user;
    const emailExist = await this.userService.findbyEmail(email);
    if (emailExist) return 'Email taken!';

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.createUser(
      name,
      hashedPassword,
      email,
    );

    return this.userService._getUserDetails(newUser);
  }
}
