import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserInterface } from './interfaces/create-user.interface';
import { FindUserInterface } from './interfaces/find-user.interface';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findUserByEmail(email: string): Promise<FindUserInterface> {
    const findUser = await this.databaseService.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    console.log(findUser[0]);

    return findUser[0];
  }

  async createUser(
    password: string,
    email: string,
    username: string,
  ): Promise<CreateUserInterface> {
    const save = await this.databaseService.query(
      'INSERT INTO users (username, email, password, status) VALUES ($1, $2, $3)',
      [username, email, password],
    );

    return save[0];
  }

  async findUserById(id: string): Promise<FindUserInterface> {
    const findUser = await this.databaseService.query(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );

    return findUser[0];
  }

  async findExistedEmail(newEmail: string): Promise<FindUserInterface[]> {
    const findExistedEmail = await this.databaseService.query(
      'SELECT * FROM users WHERE email = $1',
      [newEmail],
    );

    return findExistedEmail;
  }

  async updatePassword(newpass: string, oldpass: string): Promise<[]> {
    const update = await this.databaseService.query(
      'UPDATE users SET password = $1 WHERE password = $2',
      [newpass, oldpass],
    );

    return update[0];
  }

  async updateUsername(newUsername: string, oldUsername: string): Promise<[]> {
    const update = await this.databaseService.query(
      'UPDATE users SET username = $1 WHERE username = $2',
      [newUsername, oldUsername],
    );

    return update[0];
  }

  async updateEmail(newEmail: string, oldEmail: string): Promise<[]> {
    const update = await this.databaseService.query(
      'UPDATE users SET email = $1 WHERE email = $2',
      [newEmail, oldEmail],
    );

    return update[0];
  }

  async deleteUser(id: string): Promise<[]> {
    const deleteUser = await this.databaseService.query(
      'DELETE FROM users WHERE id = $1',
      [id],
    );

    return deleteUser[0];
  }
}
