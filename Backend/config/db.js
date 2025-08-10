import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();


const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  database: process.env.DB_NAME || "PrepMaster",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
});

export default pool;