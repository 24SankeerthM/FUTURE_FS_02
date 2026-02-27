const Chat = require('../models/Chat');

const getMessages = async (req, res) => {
    try {
        const messages = await Chat.find().populate('user', 'name').sort({ createdAt: -1 }).limit(50);
        res.json(messages.reverse());
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createMessage = async (req, res) => {
    const { message } = req.body;
    try {
        const newMessage = await Chat.create({
            user: req.user._id,
            message,
        });
        const populatedMessage = await Chat.findById(newMessage._id).populate('user', 'name');
        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

module.exports = { getMessages, createMessage };
