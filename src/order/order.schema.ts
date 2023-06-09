import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Item } from './item.schema';
import { User } from 'src/users/user.schema';

export type OrderDocument = Order & Document;
@Schema()
export class Order {
  @Prop({ required: true })
  items: Item[];

  @Prop({ required: true })
  cost: number;

  @Prop({ default: false })
  attended: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
