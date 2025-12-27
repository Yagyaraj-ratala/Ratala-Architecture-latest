import { Pool } from 'pg';

// Create a new pool of connections to the database
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'your_database_name',
  password: process.env.DB_PASSWORD || 'your_password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Export a query function that can be used to execute SQL queries
export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
};

// Export the pool for transactions or other pool-specific operations
export const db = {
  query,
  // Helper method for getting a single row or null
  oneOrNone: async (text: string, params?: any[]) => {
    const result = await query(text, params);
    return result.rows[0] || null;
  },
  // Helper method for getting a single row (throws if no rows)
  one: async (text: string, params?: any[]) => {
    const result = await query(text, params);
    if (result.rows.length === 0) {
      throw new Error('No rows returned');
    }
    return result.rows[0];
  },
  // Helper method for executing a query that doesn't return rows
  none: async (text: string, params?: any[]) => {
    await query(text, params);
  },
  // For transactions
  tx: async (callback: (client: any) => Promise<void>) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await callback(client);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
};

export default db;
