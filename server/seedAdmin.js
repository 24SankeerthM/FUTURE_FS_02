const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const userExists = await User.findOne({ email: 'admin@system.com' });

        if (userExists) {
            console.log('System Admin already exists.');
            process.exit();
        }

        const user = await User.create({
            name: 'System Admin',
            email: 'admin@system.com',
            password: 'systempassword123',
            role: 'admin'
        });

        console.log(`System Admin created: ${user.email}`);
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
