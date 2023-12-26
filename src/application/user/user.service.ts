import { Injectable, NotFoundException } from '@nestjs/common';
import { config } from 'dotenv';
import { RegisterDto } from 'src/application/user/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePassDto } from './dto/change-password.dto';
import { ChangeUsernameDto } from './dto/change-username.dto';
import { LoginDto } from './dto/login.dto';
import { UserInterface } from './interfaces/user.interface';
import { ExistingDataException } from '../../exceptions/existing-data.exceptions';
import { UserLoginInterface } from './interfaces/user-login.interface';
import { IncorrectDataException } from '../../exceptions/incorrect-data.exceptions';

config();

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async getUser(token): Promise<UserInterface> {
    const findUser = await this.userRepository.findUserById(token.user.id);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    return {
      username: findUser.username,
      email: findUser.email,
    };
  }

  async register(registerDto: RegisterDto): Promise<UserInterface> {
    const findUser = await this.userRepository.findUserByEmail(
      registerDto.email,
    );

    if (findUser) {
      throw new ExistingDataException(
        `The email: '${registerDto.email}' has already been used!`,
      );
    }

    const password = bcrypt.hashSync(registerDto.password, 10);
    const email = registerDto.email;
    const username = registerDto.username;

    const createUser = await this.userRepository.createUser(
      password,
      email,
      username,
    );

    return {
      username: createUser.username,
      email: createUser.email,
    };
  }

  async login(loginDto: LoginDto): Promise<UserLoginInterface> {
    const findUser = await this.userRepository.findUserByEmail(loginDto.email);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    const comparePassword = await bcrypt.compare(
      loginDto.password,
      findUser.password,
    );

    if (!comparePassword) {
      throw new IncorrectDataException('Incorrect password!');
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

  async changePassword(
    token,
    changePassDto: ChangePassDto,
  ): Promise<UserInterface> {
    const findUser = await this.userRepository.findUserById(token.user.id);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    if (findUser.email !== changePassDto.email) {
      throw new IncorrectDataException('Incorrect email!');
    }

    const comparePassword = await bcrypt.compare(
      changePassDto.oldPassword,
      findUser.password,
    );

    if (!comparePassword) {
      throw new IncorrectDataException('Incorrect password!');
    }

    if (changePassDto.oldPassword === changePassDto.newPassword) {
      throw new IncorrectDataException(
        'Matches were found in the old and new passwords, change new password!',
      );
    }

    const newpass = bcrypt.hashSync(changePassDto.newPassword, 10);
    const oldpass = findUser.password;

    const updatePassword = await this.userRepository.updatePassword(
      newpass,
      oldpass,
    );

    return {
      username: updatePassword.username,
      email: updatePassword.email,
    };
  }

  async changeUsername(
    token,
    changeUsernameDto: ChangeUsernameDto,
  ): Promise<UserInterface> {
    const findUser = await this.userRepository.findUserById(token.user.id);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    if (findUser.username === changeUsernameDto.username) {
      throw new IncorrectDataException(
        'Matches were found in the old and new username, change new username!',
      );
    }

    const newUsername = changeUsernameDto.username;
    const oldUsername = findUser.username;

    const updateName = await this.userRepository.updateUsername(
      newUsername,
      oldUsername,
    );

    return {
      username: updateName.username,
      email: updateName.email,
    };
  }

  async changeEmail(
    token,
    changeEmailDto: ChangeEmailDto,
  ): Promise<UserInterface> {
    const findUser = await this.userRepository.findUserById(token.user.id);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    if (findUser.email === changeEmailDto.email) {
      throw new IncorrectDataException(
        'Matches were found in the old and new email, change new email!',
      );
    }

    const newEmail = changeEmailDto.email;
    const oldEmail = findUser.email;

    const findExistedEmail =
      await this.userRepository.findExistedEmail(newEmail);

    if (findExistedEmail.length >= 1) {
      throw new ExistingDataException(
        `This email: '${newEmail}' has already been used!`,
      );
    }

    const updateEmail = await this.userRepository.updateEmail(
      newEmail,
      oldEmail,
    );

    return {
      username: updateEmail.username,
      email: updateEmail.email,
    };
  }

  async deleteUser(token): Promise<UserInterface> {
    const findUser = await this.userRepository.findUserById(token.user.id);

    if (!findUser) {
      throw new NotFoundException('User not found!');
    }

    const deleteUser = await this.userRepository.deleteUser(findUser.id);

    return {
      username: deleteUser.username,
      email: deleteUser.email,
    };
  }
}
