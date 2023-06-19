import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from 'src/order/order.schema';
import { UserSchema } from './user.schema';
import { NewUserController } from './user.controller';
import { NewUserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Order', schema: OrderSchema },
    ]),
  ],
  controllers: [NewUserController],
  providers: [NewUserService],
  exports: [NewUserService],
})
export class NewUserModule {}
