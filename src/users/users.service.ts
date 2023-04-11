import { UserDetails } from './user-details.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
  ) {}
  _getUserDetails(user: UserDocument): UserDetails {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async findbyEmail(email: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ email }).exec();
  }

  async findbyId(id: string): Promise<UserDetails | null> {
    const user = await this.UserModel.findById({ id }).exec();

    if (!user) {
      return null;
    }
    return this._getUserDetails(user);
  }

  async createUser(
    name: string,
    email: string,
    hashedPassword: string,
  ): Promise<UserDocument> {
    const newUser = new this.UserModel({
      name,
      email,
      password: hashedPassword,
    });

    return newUser.save();
  }
}
