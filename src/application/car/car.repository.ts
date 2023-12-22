import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AddCarDto } from 'src/dto/car/add-car.dto';

@Injectable()
export class CarRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findCar(number: string) {
    const find = await this.databaseService.query(
      'SELECT * FROM cars WHERE number = $1',
      [number],
    );

    return find[0];
  }

  async findCarById(id: string) {
    const find = await this.databaseService.query(
      'SELECT * FROM cars WHERE id = $1',
      [id],
    );

    return find[0];
  }

  async addCar(addCarDto: AddCarDto) {
    const name = addCarDto.name;
    const number = addCarDto.number;
    const status = 'free';

    const create = await this.databaseService.query(
      'INSERT INTO cars (name, number, status) VALUES ($1, $2, $3)',
      [name, number, status],
    );

    return create[0];
  }
}
