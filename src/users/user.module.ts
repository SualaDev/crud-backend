import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewUserController } from './user.controller';
import { NewUserService } from './user.service';
import { UserSchema } from './user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [NewUserController],
  providers: [NewUserService],
  exports: [NewUserService],
})
export class NewUserModule {}
