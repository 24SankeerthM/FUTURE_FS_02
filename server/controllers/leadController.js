const Lead = require('../models/Lead');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find({}).sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
    const { name, email, phone, source, status } = req.body;

    if (!name || !email || !phone || !source) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        const lead = new Lead({
            user: req.user._id,
            name,
            email,
            email,
            phone,
            source,
            status: status || 'New',
            tags: [],
            score: 0
        });

        const createdLead = await lead.save();
        res.status(201).json(createdLead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (lead) {
            await lead.deleteOne();
            res.json({ message: 'Lead removed' });
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add note to lead
// @route   POST /api/leads/:id/note
// @access  Private
const addNote = async (req, res) => {
    const { text } = req.body;

    try {
        const lead = await Lead.findById(req.params.id);

        if (lead) {
            const note = {
                text,
                user: req.user._id,
                createdAt: Date.now()
            };

            lead.notes.push(note);
            await lead.save();
            res.json(lead);
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk create leads
// @route   POST /api/leads/bulk
// @access  Private
const createLeadBulk = async (req, res) => {
    try {
        const leadsData = req.body.map(lead => ({
            ...lead,
            user: req.user._id,
            status: 'New',
            source: 'Import',
            score: 10,
            history: [{ action: 'Imported', user: req.user._id, details: 'Bulk Import' }]
        }));

        await Lead.insertMany(leadsData);
        res.status(201).json({ message: 'Leads imported successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLead = async (req, res) => {
    const { name, email, phone, source, status } = req.body;

    try {
        const lead = await Lead.findById(req.params.id);

        if (lead) {
            // Track changes
            if (status && status !== lead.status) {
                lead.history.push({
                    action: 'Status Change',
                    user: req.user._id,
                    details: `Changed from ${lead.status} to ${status}`
                });

                // Scoring Logic
                if (status === 'Contacted') lead.score += 10;
                if (status === 'Converted') lead.score += 50;
                if (status === 'Lost') lead.score -= 5;
            } else {
                lead.history.push({
                    action: 'Update',
                    user: req.user._id,
                    details: 'Lead details updated'
                });
            }

            lead.name = name || lead.name;
            lead.email = email || lead.email;
            lead.phone = phone || lead.phone;
            lead.source = source || lead.source;
            lead.status = status || lead.status;
            if (req.body.tags) lead.tags = req.body.tags;
            if (req.body.score !== undefined) lead.score = req.body.score;

            const updatedLead = await lead.save();
            res.json(updatedLead);
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... existing code ...

const getStats = async (req, res) => {
    // ... existing code ...
    try {
        const totalLeads = await Lead.countDocuments({});
        const newLeads = await Lead.countDocuments({ status: 'New' });
        const contacted = await Lead.countDocuments({ status: 'Contacted' });
        const converted = await Lead.countDocuments({ status: 'Converted' });
        const lost = await Lead.countDocuments({ status: 'Lost' });

        // Leads by Source
        const leadsBySource = await Lead.aggregate([
            { $group: { _id: "$source", count: { $sum: 1 } } }
        ]);

        // Monthly Growth (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyGrowth = await Lead.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            totalLeads,
            newLeads,
            contacted,
            converted,
            lost,
            leadsBySource,
            monthlyGrowth
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a public lead (no auth required)
// @route   POST /api/leads/public
// @access  Public
const createPublicLead = async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and Email are required' });
    }

    try {
        console.log('Public Lead Submission:', { name, email });
        const User = require('../models/User');
        let owner = await User.findOne();
        console.log('Owner found:', owner ? owner._id : 'None');

        if (!owner) {
            console.log('No owner found, creating admin...');
            try {
                owner = await User.create({
                    name: 'System Admin',
                    email: 'admin@system.com',
                    password: 'systempassword123',
                    role: 'admin'
                });
                console.log('Admin created:', owner._id);
            } catch (err) {
                console.error('Admin creation failed:', err);
                return res.status(500).json({ message: 'System error: Could not create admin.' });
            }
        }

        const lead = new Lead({
            user: owner._id,
            name,
            email,
            phone: phone || '',
            source: 'Web Form',
            status: 'New',
            score: 10,
            notes: message ? [{ text: `Initial Message: ${message}`, createdAt: Date.now() }] : []
        });

        await lead.save();
        console.log('Lead saved:', lead._id);
        res.status(201).json({ message: 'Lead submitted successfully' });
    } catch (error) {
        console.error('Public Lead Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getLeads, createLead, updateLead, deleteLead, addNote, getStats, createPublicLead, createLeadBulk };
