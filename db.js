import { Client } from "pg"
const client = new Client({
  connectionString : "postgres://avnadmin:AVNS_6sSl1QS1ky6k6GJrW8f@pg-2829ceb4-adeshkpatra-f9f0.a.aivencloud.com:14199/defaultdb?sslmode=require"
})

async function createTables() {
  try {
    await client.connect()

    await client.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL,
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL,
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES categories(id),
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        availability BOOLEAN NOT NULL,
        created_at TIMESTAMP NOT NULL,
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS carts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP NOT NULL,
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        cart_id INTEGER REFERENCES carts(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL,
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP NOT NULL,
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL,
    )`);
    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
}

createTables();

export default client
