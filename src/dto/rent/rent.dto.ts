import { IsNotEmpty, IsNumber } from 'class-validator';

export class RentDto {
  @IsNotEmpty()
  @IsNumber()
  days: number;
}
