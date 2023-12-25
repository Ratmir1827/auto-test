import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  car_id: string;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end_rent: Date;
}
