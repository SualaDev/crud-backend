import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';

export type ItemDocument = Item & Document;

@Schema()
export class Item {
  @Prop({ required: true, trim: true })
  item: string;

  @Prop({
    default: 1,
    validate(value: number) {
      if (value < 1) throw new BadRequestException();
    },
  })
  quantity: number;

  @Prop({
    required: true,
    validate(value: number) {
      if (value < 1) throw new BadRequestException();
    },
  })
  price: number;
}

export const itemSchema = SchemaFactory.createForClass(Item);
