import { IsNotEmpty, IsString } from 'class-validator';

export class AddCarDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  number: string;
}
