const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ date: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    const { title, date, type } = req.body;

    if (!title || !date) {
        return res.status(400).json({ message: 'Please provide title and date' });
    }

    try {
        console.log('Creating Task:', { user: req.user._id, title, date });
        const task = new Task({
            user: req.user._id,
            title,
            date,
            type: type || 'other',
        });

        const createdTask = await task.save();
        console.log('Task Created:', createdTask._id);
        res.status(201).json(createdTask);
    } catch (error) {
        console.error('Task Creation Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a task (toggle complete)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
        // Allow updating other fields too
        if (req.body.title) task.title = req.body.title;
        if (req.body.date) task.date = req.body.date;
        if (req.body.type) task.type = req.body.type;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
