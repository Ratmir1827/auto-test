import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AddCarDto } from 'src/application/car/dto/add-car.dto';
import { FindCarInterface } from './interfaces/find-car.interface';
import { AddCarInterface } from './interfaces/add-car.interface';

@Injectable()
export class CarRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findCarByCarNumber(number: string): Promise<FindCarInterface> {
    const find = await this.databaseService.query(
      'SELECT * FROM cars WHERE number = $1',
      [number],
    );

    return find[0];
  }

  async findCarById(id: string): Promise<FindCarInterface> {
    const find = await this.databaseService.query(
      'SELECT * FROM cars WHERE id = $1',
      [id],
    );

    return find[0];
  }

  async addCar(addCarDto: AddCarDto): Promise<AddCarInterface> {
    const name = addCarDto.name;
    const number = addCarDto.number;
    const status = 'free';

    await this.databaseService.query(
      'INSERT INTO cars (name, number, status) VALUES ($1, $2, $3)',
      [name, number, status],
    );

    const find = await this.databaseService.query(
      'SELECT * FROM cars WHERE number = $1',
      [number],
    );

    return find[0];
  }
}
