import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { NewOrderService } from './order.service';
import { OrderDocument } from './order.schema';

@Controller('orders')
export class NewOrderController {
  constructor(private readonly orderService: NewOrderService) {}

  @Post()
  createOrder(
    @Body()
    orderData: {
      items: { item: string; quantity: number; price: number }[];
      email: string;
    },
  ) {
    return this.orderService.createOrder(orderData.items, orderData.email);
  }

  @Get()
  async getAllOrders(): Promise<OrderDocument[]> {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  getOrderById(@Param('id') id: string): Promise<OrderDocument> {
    return this.orderService.getSingleOrder(id);
  }

  @Delete(':id')
  deleteOrderById(@Param('id') id: string) {
    return this.orderService.deleteSingleOrder(id);
  }
}
