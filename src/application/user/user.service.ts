import { Injectable, NotFoundException } from '@nestjs/common';
import { config } from 'dotenv';
import { RegisterDto } from 'src/dto/user/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dto/user/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ChangePassDto } from 'src/dto/user/change-password.dto';
import { ChangeUsernameDto } from 'src/dto/user/change-username.dto';
import { ChangeEmailDto } from 'src/dto/user/change-email.dto';
import { UserRepository } from './user.repository';

config();

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async getUser(req) {
    const findUser = await this.userRepository.findUserById(req.user.id);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    return {
      username: findUser.username,
      email: findUser.email,
    };
  }

  async register(registerDto: RegisterDto) {
    const findUser = await this.userRepository.findUser(registerDto.email);

    if (findUser) {
      return 'This user email has alredy been used!';
    }

    const password = bcrypt.hashSync(registerDto.password, 10);
    const email = registerDto.email;
    const username = registerDto.username;

    const status = 'free';

    await this.userRepository.createUser(password, email, username, status);

    return {
      username: registerDto.username,
      email: registerDto.email,
    };
  }

  async login(loginDto: LoginDto) {
    const findUser = await this.userRepository.findUser(loginDto.email);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    const comparePassword = await bcrypt.compare(
      loginDto.password,
      findUser.password,
    );

    if (!comparePassword) {
      return 'Incorrect password!';
    }

    const payload = {
      id: findUser.id,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      username: findUser?.username,
      email: findUser?.email,
      token: token,
    };
  }

  async changePassword(req, changePassDto: ChangePassDto) {
    const findUser = await this.userRepository.findUserById(req.user.id);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    if (findUser.email !== changePassDto.email) {
      return 'Incorrect email!';
    }

    const comparePassword = await bcrypt.compare(
      changePassDto.oldPassword,
      findUser.password,
    );

    if (!comparePassword) {
      return 'Incorrect password!';
    }

    if (changePassDto.oldPassword === changePassDto.newPassword) {
      return 'Change a new password!';
    }

    const newpass = bcrypt.hashSync(changePassDto.newPassword, 10);
    const oldpass = findUser.password;

    await this.userRepository.updatePassword(newpass, oldpass);

    return {
      username: findUser.username,
      email: findUser.email,
    };
  }

  async changeUsername(req, changeUsernameDto: ChangeUsernameDto) {
    const findUser = await this.userRepository.findUserById(req.user.id);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    if (findUser.username === changeUsernameDto.username) {
      return 'Change new username!';
    }

    const newUsername = changeUsernameDto.username;
    const oldUsername = findUser.username;

    await this.userRepository.updateUsername(newUsername, oldUsername);

    return {
      newUsername: newUsername,
      oldUsername: oldUsername,
      email: findUser.email,
    };
  }

  async changeEmail(req, changeEmailDto: ChangeEmailDto) {
    const findUser = await this.userRepository.findUserById(req.user.id);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    if (findUser.email === changeEmailDto.email) {
      return 'Change new email!';
    }

    const newEmail = changeEmailDto.email;
    const oldEmail = findUser.email;

    const findExistedEmail =
      await this.userRepository.findExistedEmail(newEmail);

    if (findExistedEmail.length >= 1) {
      return 'This email has alredy been used!';
    }

    await this.userRepository.updateEmail(newEmail, oldEmail);

    return {
      username: findUser.username,
      newEmail: newEmail,
      oldEmail: oldEmail,
    };
  }

  async deleteUser(req) {
    const findUser = await this.userRepository.findUserById(req.user.id);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    await this.userRepository.deleteUser(findUser.id);

    return {
      deletedUser: findUser.username,
    };
  }
}
