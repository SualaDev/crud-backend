import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/users/users.module';
import { UserSchema } from 'src/users/users.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStarategy } from './guards/jwt.strategy';
import { JwtGuard } from './guards/jwt.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    UserModule,
    JwtModule.registerAsync({
      useFactory: function () {
        return {
          secret: 'secret',
          signOptions: { expiresIn: '3600s' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStarategy, JwtGuard],
})
export class AuthModule {}
