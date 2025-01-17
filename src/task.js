const express = require('express');
const { authenticate, authorize } = require('./utils/authMiddleware');
const { pool } = require('./utils/db');

const router = express.Router();

// Common route for all roles: View Tasks
router.get('/view', authenticate, authorize('view'), async (req, res) => {
    // res.json({ message: `Tasks visible to ${req.user.role}` });
    try {
        const tasks = await pool.query('SELECT * FROM tasks');
        res.json({ tasks: tasks.rows, role: req.user.role });
    } catch (err) {
        console.error('Error viewing task', err);

        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

// Add Task: Admin and Manager
router.post('/add', authenticate, authorize('add'), async (req, res) => {
    // res.json({ message: 'Task added successfully' });
    const { task_name, assigned_to } = req.body;

    if (!task_name || !assigned_to) {
        return res.status(400).json({ error: 'Task name and assigned to are required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO tasks (task_name, assigned_to) VALUES ($1, $2) RETURNING *',
            [task_name, assigned_to]
        );
        res.json({ message: 'Task added successfully', task: result.rows[0] });
    } catch (err) {
        console.error('Error adding task',err);
        res.status(500).json({ error: 'Error adding task' });
    }
});

// Assign Task: Admin, Manager and Team Leader
router.post('/assign', authenticate, authorize('assign'), async (req, res) => {
    // res.json({ message: 'Task assigned successfully' });
    const { id, assigned_to } = req.body;

    if (!id || !assigned_to) {
        return res.status(400).json({ error: 'Task ID and assigned to are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE tasks SET assigned_to = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [assigned_to, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task assigned successfully', task: result.rows[0] });
    } catch (err) {
        console.error('Error assigning task', err);

        res.status(500).json({ error: 'Error assigning task' });
    }
});

// Change Task Status: Admin and Employee
router.patch('/status', authenticate, authorize('status'), async (req, res) => {
    // res.json({ message: 'Task status updated' });
    const { id, status } = req.body;

    if (!id || !status) {
        return res.status(400).json({ error: 'Task ID and status are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task status updated successfully', task: result.rows[0] });
    } catch (err) {
        console.error('Error updating task status', err);

        res.status(500).json({ error: 'Error updating task status' });
    }
});

module.exports = router;
