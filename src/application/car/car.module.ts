import { Module } from '@nestjs/common';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { CarRepository } from './car.repository';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [CarController],
  providers: [CarService, CarRepository, DatabaseService],
})
export class CarModule {}
