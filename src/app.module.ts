import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NewUserModule } from './users/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/auth'),
    NewUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
