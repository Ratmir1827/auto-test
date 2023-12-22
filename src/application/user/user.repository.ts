import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findUser(email: string): Promise<any> {
    const findUser = await this.databaseService.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    return findUser[0];
  }

  async createUser(password, email, username, status) {
    const save = await this.databaseService.query(
      'INSERT INTO users (username, email, password, status) VALUES ($1, $2, $3, $4)',
      [username, email, password, status],
    );

    return save[0];
  }

  async findUserById(id: string) {
    const findUser = await this.databaseService.query(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );

    return findUser[0];
  }

  async findExistedEmail(newEmail: string) {
    const findExistedEmail = await this.databaseService.query(
      'SELECT * FROM users WHERE email = $1',
      [newEmail],
    );

    return findExistedEmail;
  }

  async updatePassword(newpass: string, oldpass: string) {
    const update = await this.databaseService.query(
      'UPDATE users SET password = $1 WHERE password = $2',
      [newpass, oldpass],
    );

    return update[0];
  }

  async updateUsername(newUsername: string, oldUsername: string) {
    const update = await this.databaseService.query(
      'UPDATE users SET username = $1 WHERE username = $2',
      [newUsername, oldUsername],
    );

    return update[0];
  }

  async updateEmail(newEmail: string, oldEmail: string) {
    const update = await this.databaseService.query(
      'UPDATE users SET email = $1 WHERE email = $2',
      [newEmail, oldEmail],
    );

    return update[0];
  }

  async deleteUser(id: string) {
    const deleteUser = await this.databaseService.query(
      'DELETE FROM users WHERE id = $1',
      [id],
    );

    return deleteUser[0];
  }
}
