import { Client, Pool, PoolClient } from 'pg';

// Initialize the pool
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: '1234',
  database: 'postgres',
});

// Connect to the pool
pool.connect()
  .then((client: PoolClient) => {
    console.log('PostgreSQL connected');
    client.release();
  })
  .catch((err: Error) => console.error('PostgreSQL connection error:', err.stack));

// Initialize the client
const client = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: '1234',
  database: 'postgres',
});

// Connect the client
client.connect((err: Error) => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

// Query the database
client.query('SELECT * FROM users', (err: Error, res: { rows: any }) => {
  if (err) {
    console.error('Query error:', err.message);
  } else {
    console.log(res.rows);
  }
  client.end();
});
