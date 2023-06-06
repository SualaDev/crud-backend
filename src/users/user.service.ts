import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { UserDetails } from './user-details.interface';

@Injectable()
export class NewUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private getUserInfo(user: UserDocument): UserDetails {
    return {
      id: user._id,
      email: user.email,
      name: user.name,
    };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById({ id }).exec();
    if (!user) return null;
    return this.getUserInfo(user);
  }

  async createUser(
    name: string,
    email: string,
    hashedPassword: string,
  ): Promise<UserDocument | null> {
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });

    return newUser.save();
  }
}
