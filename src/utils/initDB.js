const { pool } = require('./db');

async function createUsersTable() {
    const client = await pool.connect();
    console.log('Creating users table...');

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                 id SERIAL PRIMARY KEY,
                 username VARCHAR(50) UNIQUE NOT NULL,
                 password TEXT NOT NULL,
                 role VARCHAR(50) NOT NULL,
                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } catch (error) {
        console.error('Error creating users table:', error);
    } finally {
        client.release();
    }
}

async function createTasksTable() {
    const client = await pool.connect();
    try {
        console.log('Creating tasks table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                task_name TEXT NOT NULL,
                assigned_to TEXT NOT NULL,
                status TEXT DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } catch (error) {
        console.error('Error creating task table:', error);
    } finally {
        client.release();
    }
}
                // updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP


async function initializeDatabase() {
    console.log('Creating  table...');

    try {
        await createUsersTable(),
        await createTasksTable()
    } catch (error) {
        console.error("Failed to initialize database:", error);
    }
}

module.exports = { initializeDatabase };