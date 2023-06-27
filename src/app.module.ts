import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NewUserModule } from './users/user.module';
import { NewOrderModule } from './order/order.module';
import { NewAuthModule } from './auth/auth.module';

import { ConfigModule } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const name = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const dbname = process.env.DATABASE_NAME;
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${name}:${password}@ayoskilolo-cluster.jbphaan.mongodb.net/${dbname}?retryWrites=true&w=majority`,
    ),
    NewUserModule,
    NewOrderModule,
    NewAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
