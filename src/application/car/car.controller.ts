import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CarService } from './car.service';
import { AddCarDto } from 'src/application/car/dto/add-car.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('car')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get('info/:id')
  @ApiOperation({ summary: 'Get car info' })
  getInfo(@Param('id') id: string) {
    return this.carService.getCarInfo(id);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add car to database' })
  addCar(@Body() addCarDto: AddCarDto) {
    return this.carService.addCar(addCarDto);
  }
}
