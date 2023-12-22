import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangeUsernameDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  username: string;
}
