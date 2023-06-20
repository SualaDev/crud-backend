import { Injectable } from '@nestjs/common';
import { NewUserService } from 'src/users/user.service';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/user.schema';
import * as bcrypt from 'bcrypt';
import { NewUserDTO } from 'src/users/dtos/new-user.dto';
import { UserDetails } from 'src/users/user-details.interface';
import { CurrentUserDTO } from 'src/users/dtos/existing-user.dto';
import { Model } from 'mongoose';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: NewUserService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async registerUser(user: Readonly<NewUserDTO>): Promise<UserDetails | any> {
    const { name, email, password } = user;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) return 'Email taken!';

    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.userService.newUser(name, email, hashedPassword);

    return this.userService.getUserInfo(newUser);
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDetails | null> {
    const user = await this.userService.findByEmail(email);
    const doesUserExist = !!user;

    if (!doesUserExist) return null;

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) return null;

    return this.userService.getUserInfo(user);
  }

  async loginUser(existingUser: CurrentUserDTO): Promise<{
    token: string;
    user: { id: string; name: string; email: string };
  } | null> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user) return null;

    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt, user };
  }
}
