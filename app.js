require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./src/auth');
const taskRoutes = require('./src/task');
const userRoutes = require('./src/register');
const { getRoles } = require('./src/roles');
const { initializeDatabase } = require('./src/utils/initDB');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/roles', getRoles);

initializeDatabase();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
