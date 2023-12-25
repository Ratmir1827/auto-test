import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RentService } from './rent.service';
import { UserGuard } from 'src/guards/user.guard';
import { RentDto } from 'src/application/rent/dto/rent.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('UserGuard')
@ApiTags('rent')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @UseGuards(UserGuard)
  @Get('info/:id')
  @ApiOperation({ summary: 'Get rent car info' })
  checkAuto(@Request() req, @Param('id') carId: string) {
    return this.rentService.checkAuto(req, carId);
  }

  @UseGuards(UserGuard)
  @Get('calculate/price/:id')
  @ApiOperation({ summary: 'Calculate rent price' })
  calculate(
    @Request() req,
    @Param('id') carId: string,
    @Body() rentDto: RentDto,
  ) {
    return this.rentService.calculate(req, carId, rentDto);
  }

  @UseGuards(UserGuard)
  @Post(':id')
  @ApiOperation({ summary: 'Rent car' })
  rent(@Param('id') carId: string, @Request() req, @Body() rentDto: RentDto) {
    return this.rentService.rent(carId, req, rentDto);
  }
}
