const mongoose = require('mongoose');

const SessionVaultSchema = new mongoose.Schema({
    streamId: { type: String, required: true, unique: true },
    platformName: { type: String, required: true },
    lenderId: { type: String, default: 'demo_lender' },
    sessionCredentials: {
        rawCookiePayload: { type: String, required: true },
        extractedExpiry: { type: Date, default: () => new Date(Date.now() + 7*24*60*60*1000) }, // 7 Days default expiry
        originIP: { type: String, default: '127.0.0.1' }
    },
    accessControl: {
        isOccupied: { type: Boolean, default: false },
        currentRenterId: { type: String, default: null },
        assignedAccessKey: { type: String, required: true },
        hourlyRateINR: { type: Number, default: 20 }
    },
    systemStatus: { type: String, default: 'active' }
});

module.exports = mongoose.model('Vault', SessionVaultSchema);