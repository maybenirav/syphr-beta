// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const cloudURI = process.env.MONGO_URI || 'mongodb+srv://syphr_root:SyphrPass123@cluster0.uqycqew.mongodb.net/syphr_campus?retryWrites=true&w=majority';
        await mongoose.connect(cloudURI);
        console.log('MongoDB connection secure.');
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;