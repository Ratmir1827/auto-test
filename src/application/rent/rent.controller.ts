import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RentService } from './rent.service';
import { UserGuard } from 'src/guards/user.guard';
import { RentDto } from 'src/dto/rent/rent.dto';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @UseGuards(UserGuard)
  @Get('info/:id')
  checkAuto(@Request() req, @Param('id') carId: string) {
    return this.rentService.checkAuto(req, carId);
  }

  @UseGuards(UserGuard)
  @Get('calculate/price/:id')
  calculate(
    @Request() req,
    @Param('id') carId: string,
    @Body() rentDto: RentDto,
  ) {
    return this.rentService.calculate(req, carId, rentDto);
  }

  @UseGuards(UserGuard)
  @Post(':id')
  rent(@Param('id') carId: string, @Request() req, @Body() rentDto: RentDto) {
    return this.rentService.rent(carId, req, rentDto);
  }
}
