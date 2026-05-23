// =========================================================================
// SYPHR VENTURE CORE ENGINE - AUTOMATED EXPIRY WATCHDOG ARCHITECTURE (2026)
// =========================================================================
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'streams.json');
const VAULT_FILE = path.join(__dirname, 'vault.json');
const ADMIN_SECRET_TOKEN = "syphr_admin_secure_vault_2026";

const readData = (file) => {
    try { 
        if (!fs.existsSync(file)) return [];
        return JSON.parse(fs.readFileSync(file, 'utf8')); 
    } catch (err) { return []; }
};

const writeData = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

// =========================================================================
// WATCHDOG ENGINE & FINANCIAL LEDGER LOOP (Runs on Background Auto-Pilot)
// =========================================================================
setInterval(() => {
    let streams = readData(DATA_FILE);
    let vault = readData(VAULT_FILE);
    let updated = false;
    const now = Date.now();

    streams = streams.map(stream => {
        if (stream.status === 'connected') {
            updated = true;
            
            // 1. Check for Automated Session Timeout Eviction
            if (stream.leaseExpiresAt && now >= stream.leaseExpiresAt) {
                console.log(`🚨 [WATCHDOG EVICTION] Lease time expired for stream: ${stream.id}. Evicting renter and locking tunnel.`);
                
                // Reset stream status back to available
                stream.status = "active";
                stream.renterId = null;
                delete stream.leaseExpiresAt;
                delete stream.timeLeftSeconds;

                // Sync updates inside vault database too
                let vaultStream = vault.find(v => v.streamId === stream.id);
                if (vaultStream) {
                    vaultStream.accessControl.isOccupied = false;
                    vaultStream.accessControl.currentRenterId = null;
                    vaultStream.systemStatus = "active";
                    // Cycle the key so old key becomes completely useless
                    vaultStream.accessControl.assignedAccessKey = `SYPHR-${crypto.randomBytes(2).toString('hex').toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
                }
                return stream;
            }

            // 2. Continuous Countdown Calculator for active leases
            if (stream.leaseExpiresAt) {
                stream.timeLeftSeconds = Math.max(0, Math.round((stream.leaseExpiresAt - now) / 1000));
            }

            // 3. Traffic Simulation
            let currentGB = parseFloat(stream.bandwidthUsed) || 0;
            stream.bandwidthUsed = `${(currentGB + 0.14).toFixed(2)} GB`;
            
            // 4. Financial ledger compound calculation
            let baseRate = parseFloat(stream.fixedRate.replace(/[^\d.]/g, '')) || 20;
            let currentEarnings = parseFloat(stream.accumulatedEarnings) || 0;
            let microPayout = (baseRate / 24 / 60 / 15); 
            stream.accumulatedEarnings = (currentEarnings + microPayout).toFixed(4);
        }
        return stream;
    });

    if (updated) {
        writeData(DATA_FILE, streams);
        writeData(VAULT_FILE, vault);
    }
}, 4000);

// =========================================================================
// NETWORK CORE API ENDPOINTS
// =========================================================================

app.post('/api/streams/launch', (req, res) => {
    try {
        const { title, lenderName, platformName, fixedRate, sessionCookie, hostel, roomNumber } = req.body;
        if (!title || !platformName || !fixedRate || !sessionCookie) {
            return res.status(400).json({ error: "Missing required parameters." });
        }

        const streamId = `stream_${Date.now()}`;
        const accessKey = `SYPHR-${crypto.randomBytes(2).toString('hex').toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

        const streams = readData(DATA_FILE);
        const publicRecord = {
            id: streamId,
            title,
            lenderName: lenderName || "Campus Lender",
            platformName,
            fixedRate: `₹${fixedRate}/Day`,
            status: "active",
            hostel: hostel || "SVNIT Hostel",
            roomNumber: roomNumber || "302",
            bandwidthUsed: "0.00 GB",
            accumulatedEarnings: "0.0000",
            sessionType: "Premium Shared Proxy"
        };
        streams.push(publicRecord);
        writeData(DATA_FILE, streams);

        const vault = readData(VAULT_FILE);
        vault.push({
            streamId,
            platformName,
            sessionCredentials: { rawCookiePayload: sessionCookie, originIP: req.ip || "127.0.0.1" },
            accessControl: { isOccupied: false, currentRenterId: null, assignedAccessKey: accessKey, hourlyRateINR: parseFloat(fixedRate) || 20 },
            systemStatus: "active"
        });
        writeData(VAULT_FILE, vault);

        res.status(201).json({ message: "Stream deployed into secure storage.", stream: publicRecord });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/streams/active', (req, res) => {
    res.json(readData(DATA_FILE));
});

// UPGRADED CONNECT HANDSHAKE: Sets a test 60-second lease timeout duration window for live demo!
app.post('/api/streams/connect', (req, res) => {
    try {
        const { streamId, renterId } = req.body;
        const streams = readData(DATA_FILE);
        const vault = readData(VAULT_FILE);
        
        const publicStream = streams.find(s => s.id === streamId);
        const vaultStream = vault.find(v => v.streamId === streamId);
        
        if (!publicStream || !vaultStream) return res.status(404).json({ error: "Not found." });
        if (publicStream.status === "connected") return res.status(400).json({ error: "Occupied." });

        // DEMO SETTING: Account only leased for 60 seconds to see live eviction without waiting 24 hours!
        const leaseDurationMs = 60 * 1000; 
        
        publicStream.status = "connected";
        publicStream.renterId = renterId || "campus_renter";
        publicStream.leaseExpiresAt = Date.now() + leaseDurationMs;
        publicStream.timeLeftSeconds = 60;

        vaultStream.accessControl.isOccupied = true;
        vaultStream.accessControl.currentRenterId = renterId || "campus_renter";
        vaultStream.systemStatus = "connected";

        writeData(DATA_FILE, streams);
        writeData(VAULT_FILE, vault);

        console.log(`⚡ [TUNNEL INITIALIZED] 60-Second Countdown Timer ticking for stream: ${streamId}`);
        res.json({ message: "Tunnel Active!", accessKey: vaultStream.accessControl.assignedAccessKey });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/streams/:id', (req, res) => {
    let streams = readData(DATA_FILE).filter(s => s.id !== req.params.id);
    let vault = readData(VAULT_FILE).filter(v => v.streamId !== req.params.id);
    writeData(DATA_FILE, streams); writeData(VAULT_FILE, vault);
    res.json({ message: "Scrubbed." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`====================================================================`);
    console.log(`💼 SYPHR Venture Core Engine: Automated Watchdog Core Online!`);
    console.log(`⏱️ Lease Timeout Monitor active (Demo mode: 60 Seconds eviction window)`);
    console.log(`====================================================================`);
});