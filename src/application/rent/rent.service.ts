import { Injectable, NotFoundException } from '@nestjs/common';
import { RentRepository } from './rent.repository';
import { RentDto } from 'src/application/rent/dto/rent.dto';
import { RentInfoInterface } from './interfaces/rent-info.interface';
import { RentalException } from 'src/exceptions/rental-time.exception';
import { RentInterface } from './interfaces/rent.interface';
import { CalculateInterface } from './interfaces/calculate.interface';

@Injectable()
export class RentService {
  constructor(private readonly rentRepository: RentRepository) {}

  async checkAuto(req, carId: string): Promise<RentInfoInterface> {
    const findUser = await this.rentRepository.findUser(req.user.id);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    const findCar = await this.rentRepository.findCar(carId);

    if (!findCar) {
      throw new NotFoundException('Car not found!');
    }

    await this.rentRepository.checkEndedReservation();

    const checkReservation = await this.rentRepository.checkReservation(
      findCar.id,
    );

    if (checkReservation) {
      return {
        user: findUser.id,
        username: findUser.username,
        car: findCar.id,
        car_number: findCar.number,
        car_status: 'leasing',
      };
    }

    return {
      user: findUser.id,
      username: findUser.username,
      car: findCar.id,
      car_number: findCar.number,
      car_status: 'free',
    };
  }

  async calculate(
    req,
    carId: string,
    rentDto: RentDto,
  ): Promise<RentInterface> {
    const findUser = await this.rentRepository.findUser(req.user.id);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    const findCar = await this.rentRepository.findCar(carId);

    if (!findCar) {
      throw new NotFoundException('Car not found!');
    }

    const rentPrice = await this.calculatePrice(rentDto.days);

    return {
      username: findUser.username,
      car_number: findCar.number,
      price: rentPrice.price,
    };
  }

  async rent(carId: string, req, rentDto: RentDto): Promise<RentInterface> {
    const startDate = new Date();
    const endDate = new Date(startDate);

    await this.rentRepository.checkEndedReservation();

    const rentPrice = await this.calculatePrice(rentDto.days);

    const findUser = await this.rentRepository.findUser(req.user.id);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    const findCar = await this.rentRepository.findCar(carId);

    if (!findCar) {
      throw new NotFoundException('Car not found!');
    }

    const findExistReservation =
      await this.rentRepository.checkExistReservation(findUser.id);

    if (findExistReservation) {
      throw new RentalException('You have already rented a car!');
    }

    const checkCarReservation = await this.rentRepository.checkReservation(
      findCar.id,
    );

    if (checkCarReservation) {
      throw new RentalException('This car has already been in reserved!');
    }

    const userId = findUser.id;
    endDate.setDate(startDate.getDate() + rentDto.days);

    await this.rentRepository.rent(userId, carId, startDate, endDate);

    return {
      username: findUser.username,
      car_number: findCar.number,
      price: rentPrice.price,
    };
  }

  async calculatePrice(days: number): Promise<CalculateInterface> {
    let rentalCost = 1000 * days;

    if (days === 0) {
      throw new RentalException(`Minimum rental period 1 day`);
    } else if (days >= 5 && days <= 9) {
      rentalCost -= rentalCost * 0.05;
    } else if (days >= 10 && days <= 17) {
      rentalCost -= rentalCost * 0.1;
    } else if (days >= 18 && days <= 29) {
      rentalCost -= rentalCost * 0.15;
    } else if (days > 30) {
      throw new RentalException(`Maximum rental period 30 days`);
    }

    return {
      price: rentalCost,
    };
  }
}
