import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { Pool } from 'pg';

config();

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER || '',
      host: process.env.DB_HOST || '',
      database: process.env.DB_NAME || '',
      password: process.env.DB_PASSWORD || '',
      port: Number(process.env.DB_PORT) || 5432,
    });
  }

  async query(query: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }
}
