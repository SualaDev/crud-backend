import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/users.schema';
import { UserService } from 'src/users/users.service';
import { NewUserDTO } from 'src/users/dto/new-user.dto';
import { UserDetails } from 'src/users/user-details.interface';
import { ExistingUserDto } from 'src/users/dto/existing-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async register(user: NewUserDTO): Promise<UserDetails | null> {
    const { name, email, password } = user;
    const isEmailTaken = await this.userService.findbyEmail(email);
    if (isEmailTaken) return null;

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.createUser(
      name,
      email,
      hashedPassword,
    );

    return this.userService._getUserDetails(newUser);
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
    const user = await this.userService.findbyEmail(email);
    const doesEmailExist = !!user;
    if (!doesEmailExist) return null;

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );
    if (!doesPasswordMatch) return null;

    return this.userService._getUserDetails(user);
  }

  async login(existingUser: ExistingUserDto): Promise<{
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
