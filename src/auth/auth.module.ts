import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { NewUserModule } from 'src/users/user.module';
import { UserSchema } from 'src/users/user.schema';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './guards/jwt.strategy';
import { JwtGuard } from './guards/jwt.guard';
import { AuthenticationService } from './auth.service';

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
  providers: [JwtStrategy, JwtGuard, AuthenticationService],
})
export class NewAuthModule {}
