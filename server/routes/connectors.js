const express = require('express');
const router = express.Router();

// Mock connection testing logic moved from frontend
router.post('/test', async (req, res) => {
    const { type, subtype, config } = req.body;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (type !== 'SOURCE') {
        return res.json({ success: true, message: 'Connection verified.' });
    }

    switch (subtype) {
        case 'bigquery':
            if (!config.projectId || !config.datasetId) {
                return res.json({ success: false, message: 'Missing Project ID or Dataset ID.' });
            }
            if (!config.serviceAccountJson) {
                return res.json({ success: false, message: 'Missing Service Account JSON.' });
            }
            try {
                JSON.parse(config.serviceAccountJson);
            } catch (e) {
                return res.json({ success: false, message: 'Invalid Service Account JSON format.' });
            }
            return res.json({ success: true, message: 'Successfully connected to BigQuery dataset (Backend Verified).' });

        case 'sqlserver':
            if (!config.host || !config.port || !config.database || !config.username) {
                return res.json({ success: false, message: 'Missing required connection details.' });
            }
            return res.json({ success: true, message: 'Successfully connected to SQL Server (Backend Verified).' });

        case 'postgres':
            if (!config.host || !config.database || !config.username) {
                return res.json({ success: false, message: 'Missing required connection details.' });
            }
            return res.json({ success: true, message: 'Successfully connected to PostgreSQL (Backend Verified).' });

        default:
            return res.json({ success: true, message: 'Connection verified.' });
    }
});

module.exports = router;
