import { Injectable, NotFoundException } from '@nestjs/common';
import { CarRepository } from './car.repository';
import { AddCarDto } from 'src/application/car/dto/add-car.dto';
import { CarInfoInterface } from './interfaces/car-info.interface';
import { ExistingDataException } from 'src/exceptions/existing-data.exceptions';
import { AddCarInterface } from './interfaces/add-car.interface';

@Injectable()
export class CarService {
  constructor(private readonly carRepository: CarRepository) {}

  async getCarInfo(id: string): Promise<CarInfoInterface> {
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

  async addCar(addCarDto: AddCarDto): Promise<AddCarInterface> {
    const findExistedCar = await this.carRepository.findCarByCarNumber(
      addCarDto.number,
    );

    if (findExistedCar) {
      throw new ExistingDataException('This car has alredy been added!');
    }

    const addCar = await this.carRepository.addCar(addCarDto);

    console.log(addCar);

    return {
      id: addCar?.id,
      name: addCar.name,
      number: addCar.number,
      status: addCar.status,
    };
  }
}
