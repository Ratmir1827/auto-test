import { ApiProperty } from '@nestjs/swagger';

export class Car {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  number: string;

  @ApiProperty()
  status: string;
}
