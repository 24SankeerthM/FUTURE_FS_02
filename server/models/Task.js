const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true, 'Please add a task title'],
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
    },
    type: {
        type: String,
        enum: ['call', 'meeting', 'email', 'other'],
        default: 'other',
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
