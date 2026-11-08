import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

console.log('DATABASE_URL încărcat:', dbUrl ? 'DA' : 'NU');

// Supabase / hosted Postgres instances enforce SSL connections.
const useSsl =
  process.env.PGSSLMODE === 'require' ||
  (dbUrl && (dbUrl.includes('supabase.co') || dbUrl.includes('sslmode=require')));

export const pool = new Pool({
  connectionString: dbUrl,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});

if (dbUrl) {
  pool
    .query('SELECT current_user, current_database()')
    .then((r) => {
      console.log('Node se conectează ca:', r.rows[0]);
    })
    .catch((err) => {
      console.error('Eroare conexiune DB la pornire:', err.message);
    });
}

pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client', err);
});

export async function queryAsDispatcher(dispatcher, queryText, params = []) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`SELECT set_config('app.current_city', $1, true)`, [dispatcher.city]);
    await client.query(`SELECT set_config('app.current_role', $1, true)`, [dispatcher.role]);

    const result = await client.query(queryText, params);

    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}



