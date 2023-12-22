import { Injectable, NotFoundException } from '@nestjs/common';
import { CarRepository } from './car.repository';
import { AddCarDto } from 'src/dto/car/add-car.dto';

@Injectable()
export class CarService {
  constructor(private readonly carRepository: CarRepository) {}

  async getCarInfo(id: string) {
    const findCarById = await this.carRepository.findCarById(id);

    if (!findCarById) {
      throw new NotFoundException('Car not found!');
    }

    return {
      name: findCarById.name,
      number: findCarById.number,
      status: findCarById.status,
    };
  }

  async addCar(addCarDto: AddCarDto) {
    const findExistedCar = await this.carRepository.findCar(addCarDto.number);

    if (findExistedCar) {
      return 'This car has alredy been added!';
    }

    await this.carRepository.addCar(addCarDto);

    return {
      name: addCarDto.name,
      number: addCarDto.number,
      status: 'free',
    };
  }
}
