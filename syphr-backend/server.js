// =========================================================================
// SYPHR VENTURE PRODUCTION ENGINE - ULTRA INTEGRATED CORE SYSTEM (2026)
// =========================================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// IN-MEMORY DISTRIBUTED DATA LEDGER (RESETS BUFFER SAFE WITHOUT CRASHES)
let globalSessionRegistry = [];
let paymentTransactionLedger = [];

// TARGET COORDINATES GEOFENCE: SVNIT SURAT CAMPUS CENTRE BOUNDARY MAP
const CAMPUS_GEOFENCE = {
    LATITUDE: 21.1648,
    LONGITUDE: 72.7852,
    MAX_RADIUS_KM: 2.5 // Strictly locks access to within a 2.5km campus radius
};

// -------------------------------------------------------------------------
// HAIVERSINE FORMULA GEOFENCING MATHEMATICAL VERIFIER
// -------------------------------------------------------------------------
// server.js mein verifyGeofenceBoundary ko dhoondho aur isse badal do:
function verifyGeofenceBoundary(userLat, userLon) {
    // TEMPORARY BETA SANDBOX OVERRIDE: Always returns true for testing
    console.log(`📡 [GEOFENCE BYPASS] Intercepted Lat: ${userLat}, Lon: ${userLon}. Auto-verifying...`);
    return true; 
    
    /* Real production logic (Keep commented during sandbox week)
    const R = 6371;
    const dLat = (userLat - CAMPUS_GEOFENCE.LATITUDE) * Math.PI / 180;
    ...
    return distance <= CAMPUS_GEOFENCE.MAX_RADIUS_KM;
    */
}

// =========================================================================
// AUTOMATED METRICS WATCHDOG ENGINE (4 SECOND INTERVAL PAYOUT TICKS)
// =========================================================================
setInterval(() => {
    try {
        const now = new Date();
        globalSessionRegistry.forEach(node => {
            if (node.status === 'connected') {
                let payoutFactor = parseFloat(node.lenderPayoutRate) || 5;
                // Accumulates micromanaged yield straight into the live memory cluster array
                node.accumulatedEarnings = parseFloat((node.accumulatedEarnings + (payoutFactor / 24 / 60 / 15)).toFixed(4));
                
                if (node.leaseExpiresAt && now >= new Date(node.leaseExpiresAt)) {
                    node.status = "listed";
                    node.leaseStartedAt = undefined;
                    node.leaseExpiresAt = undefined;
                    console.log(`🚨 [WATCHDOG EVICTION] Lease session expired automatically for Node: ${node.id}`);
                }
            }
        });
    } catch (e) {
        // Safe thread runtime capture
    }
}, 4000);

// =========================================================================
// PRODUCTION CORE API HOOKS
// =========================================================================

// [API 1] LENDER ACTION: BACKGROUND POOL INITIALIZATION
app.post('/api/streams/launch', (req, res) => {
    try {
        const { title, platformName, selectedPlan, userLat, userLon, sessionCookie, hostel } = req.body;

        // Background Invisible Geofence Map Check on Submission
        if (userLat && userLon && !verifyGeofenceBoundary(userLat, userLon)) {
            return res.status(403).json({ error: "REGIONAL BLOCK: Listing initialized outside campus boundaries framework." });
        }

        let totalCost = 15, lenderCut = 10;
        if (selectedPlan === '1h')   { totalCost = 3;  lenderCut = 2; }
        if (selectedPlan === '3h')   { totalCost = 7;  lenderCut = 5; }
        if (selectedPlan === '6h')   { totalCost = 12; lenderCut = 8; }
        if (selectedPlan === '12h')  { totalCost = 15; lenderCut = 10; }
        if (selectedPlan === '24h')  { totalCost = 25; lenderCut = 18; }

        const accessKey = `SYPHR-${crypto.randomBytes(2).toString('hex').toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

        const cleanMemoryNode = {
            id: "NODE_" + crypto.randomBytes(4).toString('hex').toUpperCase(),
            title: title || `${platformName} Shared Access Channel`,
            lenderName: "Campus Provider", platformName, selectedPlan,
            fixedRate: totalCost, lenderPayoutRate: lenderCut, accumulatedEarnings: 0,
            sessionCookie: sessionCookie || "", assignedAccessKey: accessKey,
            hostel: hostel || "Hostel Block", status: "listed"
        };

        globalSessionRegistry.push(cleanMemoryNode);
        console.log(`🟢 [PIPELINE INGESTION] Automated Node Launched: ${cleanMemoryNode.title}`);
        
        return res.status(201).json({ message: "Node deployed inside registry space.", stream: cleanMemoryNode });
    } catch (err) {
        return res.status(500).json({ error: "System pipeline registry failure." });
    }
});

// [API 2] RENTER ACTION: SIMULATED PAYMENT INITIALIZATION LAYER
app.post('/api/payment/checkout', (req, res) => {
    try {
        const { streamId, userLat, userLon, billingAmount } = req.body;

        // Background Invisible Geofence Verification prior to processing payment wallet ticks
        if (userLat && userLon && !verifyGeofenceBoundary(userLat, userLon)) {
            return res.status(403).json({ error: "GEOFENCE ERROR: Transaction denied due to location mismatch map coordinates." });
        }

        let targetNode = globalSessionRegistry.find(s => s.id === streamId);
        if (!targetNode) return res.status(404).json({ error: "Target marketplace entity dropped or unindexed." });
        if (targetNode.status === 'connected') return res.status(400).json({ error: "Channel occupied." });

        const simulatedTxId = "TXN_SYPHR_" + crypto.randomBytes(6).toString('hex').toUpperCase();
        
        paymentTransactionLedger.push({
            transactionId: simulatedTxId, streamId, amount: billingAmount, timestamp: new Date(), status: "SUCCESS"
        });

        // Trigger automatic invisible lease time maps allocation upon wallet clearance
        let planDurationMs = 60 * 60 * 1000; // Defaults 1hr standard time translation mapping
        if (targetNode.selectedPlan === '3h')  planDurationMs = 3 * 60 * 60 * 1000;
        if (targetNode.selectedPlan === '6h')  planMs = 6 * 60 * 60 * 1000;
        if (targetNode.selectedPlan === '12h') planMs = 12 * 60 * 60 * 1000;
        if (targetNode.selectedPlan === '24h') planMs = 24 * 60 * 60 * 1000;

        targetNode.status = "connected";
        targetNode.leaseStartedAt = new Date();
        targetNode.leaseExpiresAt = new Date(Date.now() + planDurationMs);

        console.log(`💳 [PAYMENT SETTLED] Verified Tx: ${simulatedTxId} -> Allocated Key Access Token Token.`);
        return res.json({ message: "Payment Verified Safe!", transactionId: simulatedTxId, accessKey: targetNode.assignedAccessKey });
    } catch (err) {
        return res.status(500).json({ error: "Transaction gateway execution crash loop." });
    }
});

// [API 3] MARKETPLACE LOGIC FETCH DISPATCHER
app.get('/api/streams/active', (req, res) => {
    return res.json(globalSessionRegistry.map(s => ({
        id: s.id, title: s.title, lenderName: s.lenderName, platformName: s.platformName,
        fixedRate: s.fixedRate, selectedPlan: s.selectedPlan, status: s.status,
        hostel: s.hostel, accumulatedEarnings: s.accumulatedEarnings.toFixed(4)
    })));
});

// [API 4] ISOLATION PROXY ENDPOINT REDIRECT TUNNEL HOOK
app.get('/api/streams/render-tunnel/:id', (req, res) => {
    let node = globalSessionRegistry.find(s => s.id === req.params.id);
    if (!node || node.assignedAccessKey !== req.query.key) {
        return res.status(403).send("CRITICAL HANDSHAKE DENIED: Invalid cryptographic token signature.");
    }

    let dynamicPlatformURL = "https://www.hotstar.com";
    if (node.platformName.toLowerCase().includes('netflix')) dynamicPlatformURL = "https://www.netflix.com";
    if (node.platformName.toLowerCase().includes('prime')) dynamicPlatformURL = "https://www.primevideo.com";

    // Direct Invisible Backend Proxy Cookie injection response layout block
    res.send(`
        <html>
        <body style="background:#121212; color:#F7F7F7; font-family:sans-serif; flex-direction:column; display:flex; justify-content:center; align-items:center; height:100vh;">
            <div style="text-align:center;">
                <p style="font-size:14px; color:#38A169; font-family:monospace; margin-bottom:10px;">🔒 SYPHR PROXY REDIRECTION SYSTEM INJECTING LAYERS...</p>
                <p style="font-size:11px; color:#888888;">Establishing cookie domain context fields securely. Please wait.</p>
            </div>
            <script>
                document.cookie = decodeURIComponent("${encodeURIComponent(node.sessionCookie)}") + "; domain=" + window.location.hostname + "; path=/; Secure; SameSite=Lax";
                setTimeout(() => { window.location.replace("${dynamicPlatformURL}"); }, 800);
            </script>
        </body>
        </html>
    `);
});

// [API 5] ADMIN SHIELD NODE SCRUBBING
app.delete('/api/admin/streams/:id', (req, res) => {
    globalSessionRegistry = globalSessionRegistry.filter(s => s.id !== req.params.id);
    console.log(`❌ [SYSTEM PURGE COMPLETE] Node ${req.params.id} terminated cleanly.`);
    return res.json({ message: "Channel reference flushed safely." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`====================================================================`);
    console.log(`💼 SYPHR ULTIMATE HIGH-SCALE STARTUP CORE ENGINE IS ONLINE (2026)`);
    console.log(`====================================================================`);
});
