const mongoose = require('mongoose');

const leadSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // The agent/admin who created or is assigned
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true, // e.g., Website, Referral, Cold Call
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Converted', 'Lost'],
        default: 'New',
    },
    score: {
        type: Number,
        default: 0,
    },
    history: [{
        action: String, // e.g., 'Status Change', 'Note Added', 'Email Sent'
        details: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now }
    }],
    tags: [{
        type: String,
    }],
    notes: [
        {
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
    ]
}, {
    timestamps: true,
});

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;
