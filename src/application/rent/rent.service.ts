import { Injectable, NotFoundException } from '@nestjs/common';
import { RentRepository } from './rent.repository';
import { RentDto } from 'src/dto/rent/rent.dto';

@Injectable()
export class RentService {
  constructor(private readonly rentRepository: RentRepository) {}

  async checkAuto(req, carId: string) {
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

  async calculate(req, carId: string, rentDto: RentDto) {
    const findUser = await this.rentRepository.findUser(req.user.id);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    const findCar = await this.rentRepository.findCar(carId);

    if (!findCar) {
      throw new NotFoundException('Car not found!');
    }

    const rentPrice = await this.calculatePrice(rentDto.days);

    if (
      rentPrice === 'Minimum rental period 1 day' ||
      rentPrice === 'Maximum rental period 30 days'
    ) {
      return rentPrice;
    }

    return {
      user: findUser.id,
      username: findUser.username,
      car: findCar.id,
      car_number: findCar.number,
      days: rentDto.days,
      price: rentPrice,
    };
  }

  async rent(carId: string, req, rentDto: RentDto) {
    const startDate = new Date();
    const endDate = new Date(startDate);

    await this.rentRepository.checkEndedReservation();

    const rentPrice = await this.calculatePrice(rentDto.days);

    if (
      rentPrice === 'Minimum rental period 1 day' ||
      rentPrice === 'Maximum rental period 30 days'
    ) {
      return rentPrice;
    }

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
      return 'You have already rented a car!';
    }

    const checkCarReservation = await this.rentRepository.checkReservation(
      findCar.id,
    );

    if (checkCarReservation) {
      return 'This car has already been in reserved!';
    }

    const checkUserStatus = await this.rentRepository.checkUserStatus(
      findUser.id,
    );

    if (checkUserStatus === 'blocked') {
      return 'This user in blocked now!';
    }

    const userId = findUser.id;
    endDate.setDate(startDate.getDate() + rentDto.days);

    await this.rentRepository.rent(userId, carId, startDate, endDate);

    return {
      user: findUser.username,
      price: rentPrice,
      car: findCar.number,
    };
  }

  async calculatePrice(days: number) {
    let rentalCost = 1000 * days;

    if (days === 1) {
      return 'Minimum rental period 1 day';
    } else if (days >= 5 && days <= 9) {
      rentalCost -= rentalCost * 0.05;
    } else if (days >= 10 && days <= 17) {
      rentalCost -= rentalCost * 0.1;
    } else if (days >= 18 && days <= 29) {
      rentalCost -= rentalCost * 0.15;
    } else if (days > 30) {
      return 'Maximum rental period 30 days';
    }

    return rentalCost;
  }
}
