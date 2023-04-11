import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: 'UserSchema' }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
