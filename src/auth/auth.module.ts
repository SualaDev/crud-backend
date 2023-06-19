import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NewUserModule } from 'src/users/user.module';
import { AuthController } from './auth.controller';
import { AuthenticationService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { UserSchema } from 'src/users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    NewUserModule,
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
  providers: [AuthenticationService, JwtGuard, JwtStrategy],
})
export class NewAuthModule {}
