import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// postgres (sql template tag) — lightweight, no ORM overhead
// Automatically pools connections
const sql = postgres(DATABASE_URL, {
  max: 10,            // max pool connections
  idle_timeout: 30,   // close idle connections after 30s
  connect_timeout: 10,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

export default sql;
