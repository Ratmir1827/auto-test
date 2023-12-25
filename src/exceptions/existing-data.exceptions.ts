import { HttpException, HttpStatus } from '@nestjs/common';

export class ExistingDataException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
