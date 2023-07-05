import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NewUserModule } from './users/user.module';
import { NewOrderModule } from './order/order.module';
import { NewAuthModule } from './auth/auth.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb+srv://tamunosiesualaamotsuka:<password>@cluster0.3lnlyqf.mongodb.net/?retryWrites=true&w=majority'),
    NewUserModule,
    NewOrderModule,
    NewAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
