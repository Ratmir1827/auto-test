import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CarService } from './car.service';
import { AddCarDto } from 'src/dto/car/add-car.dto';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get('info/:id')
  getInfo(@Param('id') id: string) {
    return this.carService.getCarInfo(id);
  }

  @Post('add')
  addCar(@Body() addCarDto: AddCarDto) {
    return this.carService.addCar(addCarDto);
  }
}
