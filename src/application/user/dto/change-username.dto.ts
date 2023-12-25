import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangeUsernameDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  @ApiProperty()
  username: string;
}
