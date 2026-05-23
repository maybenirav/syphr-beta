// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+edu$/, 'Please use a valid college .edu email identity'] 
    },
    password: { type: String, required: true },
    hostel: { type: String, required: true },
    roomNumber: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);