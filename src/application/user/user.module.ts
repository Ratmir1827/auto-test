import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPERIENCE },
      }),
    }),
  ],
  providers: [UserService, DatabaseService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
