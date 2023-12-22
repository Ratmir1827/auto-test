import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './application/user/user.module';
import { CarModule } from './application/car/car.module';
import { RentModule } from './application/rent/rent.module';

@Module({
  imports: [DatabaseModule, UserModule, CarModule, RentModule],
})
export class AppModule {}
