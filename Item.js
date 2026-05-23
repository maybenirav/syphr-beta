// models/Item.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    category: { type: String, default: 'General' },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);