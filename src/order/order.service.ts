import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './order.schema';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { User, UserDocument } from 'src/users/user.schema';
import { Item, ItemDocument } from './item.schema';
import sgMail from '@sendgrid/mail';

@Injectable()
export class NewOrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
  ) {}

  async sendEmail(
    items: { item: string; quantity: number; price: number }[],
    email: string,
  ) {
    const itemNames = items.map((v) => v.item);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const message = {
      to: `${email}`,
      from: process.env.EMAIL,
      subject: 'Confirmation of Order',
      text: `Thank you for shopping with Suala Stores.Please if you have any issues with your order, reply this mail /n Your order: ${itemNames.join(
        ', ',
      )}`,
    };

    try {
      sgMail.send(message);
    } catch (e) {
      throw new InternalServerErrorException('Unable to send email');
    }
  }

  async createOrder(
    items: { item: string; quantity: number; price: number }[],
    email: string,
  ) {
    let totalCost = 0;
    for (let index = 0; index > items.length; index++) {
      const value = items[index];
      totalCost += value.price;
      items[index] = new this.itemModel({ ...value });
    }

    const user = await this.userModel.findOne({ email });
    const order = new this.orderModel({
      items,
      cost: totalCost,
      attended: false,
      owner: user._id,
    });

    try {
      const result = await order.save();
      try {
        await this.sendEmail(order.items, email);
      } catch (e) {
        throw new InternalServerErrorException('Failed email');
      }
      return result;
    } catch {
      throw new BadRequestException('Improper data provided');
    }
  }

  async getAllOrders() {
    try {
      const orders = await this.orderModel.find({});
      return orders;
    } catch {
      throw new ServiceUnavailableException('Pls try again later');
    }
  }

  async getSingleOrder(id: string) {
    try {
      const order = await this.orderModel.findById(id);
      if (!order) throw new BadRequestException('Invalid Request');
      return order;
    } catch {
      throw new BadRequestException('Invalid Request');
    }
  }

  async deleteSingleOrder(id: string) {
    try {
      const order = await this.orderModel.findByIdAndDelete(id);
      if (!order) throw new BadRequestException('Invalid Request');
      return order;
    } catch {
      throw new BadRequestException('Invalid Request');
    }
  }
}
