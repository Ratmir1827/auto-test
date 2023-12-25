import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { FindUserInterface } from './interfaces/find-user.interface';
import { FindCarInterface } from './interfaces/find-car.interface';

@Injectable()
export class RentRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findUser(id: string): Promise<FindUserInterface> {
    const findUser = await this.databaseService.query(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );

    return findUser[0];
  }

  async checkEndedReservation() {
    await this.databaseService.query(
      'DELETE FROM rent WHERE end_rent <= CURRENT_TIMESTAMP',
    );
  }

  async findCar(carId: string): Promise<FindCarInterface> {
    const findCar = await this.databaseService.query(
      'SELECT * FROM cars WHERE id = $1',
      [carId],
    );

    return findCar[0];
  }

  async checkExistReservation(userId: string): Promise<[]> {
    const findExist = await this.databaseService.query(
      'SELECT * FROM rent WHERE user_id = $1',
      [userId],
    );

    return findExist[0];
  }

  async checkReservation(id: string): Promise<[]> {
    const findReservation = await this.databaseService.query(
      'SELECT * FROM rent WHERE car_id = $1',
      [id],
    );

    return findReservation[0];
  }

  async rent(
    userId: string,
    carId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<[]> {
    const rentCar = await this.databaseService.query(
      'INSERT INTO rent (user_id, car_id, start, end_rent) VALUES ($1, $2, $3, $4)',
      [userId, carId, startDate, endDate],
    );

    return rentCar[0];
  }
}
