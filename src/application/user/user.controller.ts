import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from 'src/dto/user/register.dto';
import { LoginDto } from 'src/dto/user/login.dto';
import { ChangePassDto } from 'src/dto/user/change-password.dto';
import { ChangeUsernameDto } from 'src/dto/user/change-username.dto';
import { ChangeEmailDto } from 'src/dto/user/change-email.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UseGuards)
  @Get('get')
  getUser(@Request() req) {
    return this.userService.getUser(req);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @UseGuards(UseGuards)
  @Post('change/password')
  changePassword(@Request() req, @Body() changePassDto: ChangePassDto) {
    return this.userService.changePassword(req, changePassDto);
  }

  @UseGuards(UseGuards)
  @Post('change/username')
  changeUsername(@Request() req, @Body() changeUsernameDto: ChangeUsernameDto) {
    return this.userService.changeUsername(req, changeUsernameDto);
  }

  @UseGuards(UseGuards)
  @Post('change/email')
  changeEmail(@Request() req, @Body() changeEmailDto: ChangeEmailDto) {
    return this.userService.changeEmail(req, changeEmailDto);
  }

  @UseGuards(UseGuards)
  @Delete('delete')
  deleteUser(@Request() req) {
    return this.userService.deleteUser(req);
  }
}
