import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const hash = await bcrypt.hash('senha123', 10);
await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hash, 'chicomoedas@gmail.com']);
console.log('Password reset for chicomoedas@gmail.com');
await pool.end();
