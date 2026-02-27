const Announcement = require('../models/Announcement');

const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ active: true }).sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createAnnouncement = async (req, res) => {
    const { title, message, type } = req.body;
    try {
        const announcement = await Announcement.create({
            title,
            message,
            type,
            createdBy: req.user._id,
        });
        res.status(201).json(announcement);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

module.exports = { getAnnouncements, createAnnouncement };
