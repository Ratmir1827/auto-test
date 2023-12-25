import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from 'src/application/user/dto/register.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePassDto } from './dto/change-password.dto';
import { ChangeUsernameDto } from './dto/change-username.dto';
import { LoginDto } from './dto/login.dto';
import { UserGuard } from 'src/guards/user.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserGuard)
  @Get('get')
  @ApiOperation({ summary: 'Get user' })
  getUser(@Request() token) {
    return this.userService.getUser(token);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @UseGuards(UserGuard)
  @Post('change/password')
  @ApiOperation({ summary: 'Change password' })
  changePassword(@Request() token, @Body() changePassDto: ChangePassDto) {
    return this.userService.changePassword(token, changePassDto);
  }

  @UseGuards(UserGuard)
  @Post('change/username')
  @ApiOperation({ summary: 'Change username' })
  changeUsername(
    @Request() token,
    @Body() changeUsernameDto: ChangeUsernameDto,
  ) {
    return this.userService.changeUsername(token, changeUsernameDto);
  }

  @UseGuards(UserGuard)
  @Post('change/email')
  @ApiOperation({ summary: 'Change email' })
  changeEmail(@Request() token, @Body() changeEmailDto: ChangeEmailDto) {
    return this.userService.changeEmail(token, changeEmailDto);
  }

  @UseGuards(UserGuard)
  @Delete('delete')
  @ApiOperation({ summary: 'Delete user' })
  deleteUser(@Request() token) {
    return this.userService.deleteUser(token);
  }
}
