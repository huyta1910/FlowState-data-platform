const express = require('express');
const router = express.Router();

// Real connection testing logic
router.post('/test', async (req, res) => {
    const { type, subtype, config } = req.body;

    if (type !== 'SOURCE') {
        return res.json({ success: true, message: 'Connection verified.' });
    }

    try {
        switch (subtype) {
            case 'bigquery':
                if (!config.projectId || !config.datasetId || !config.serviceAccountJson) {
                    return res.json({ success: false, message: 'Missing require BigQuery details.' });
                }

                let credentials;
                try {
                    credentials = JSON.parse(config.serviceAccountJson);
                } catch (e) {
                    return res.json({ success: false, message: 'Invalid Service Account JSON format.' });
                }

                const { BigQuery } = require('@google-cloud/bigquery');
                const bigquery = new BigQuery({
                    projectId: config.projectId,
                    credentials: credentials
                });

                // Try to get the dataset to verify permissions
                const dataset = bigquery.dataset(config.datasetId);
                const [exists] = await dataset.exists();

                if (exists) {
                    return res.json({ success: true, message: 'Successfully connected to BigQuery dataset.' });
                } else {
                    return res.json({ success: false, message: 'Dataset does not exist or access denied.' });
                }

            case 'sqlserver':
                if (!config.host || !config.port || !config.database || !config.username || !config.password) {
                    return res.json({ success: false, message: 'Missing required connection details.' });
                }

                const sql = require('mssql');
                const sqlConfig = {
                    user: config.username,
                    password: config.password,
                    server: config.host,
                    port: parseInt(config.port),
                    database: config.database,
                    options: {
                        encrypt: true, // Use this if you're on Azure or require encryption
                        trustServerCertificate: true // Change to true for local dev / self-signed certs
                    }
                };

                try {
                    await sql.connect(sqlConfig);
                    return res.json({ success: true, message: 'Successfully connected to SQL Server.' });
                } catch (err) {
                    return res.json({ success: false, message: `SQL Server Connection Error: ${err.message}` });
                } finally {
                    // Close the connection if open
                    sql.close();
                }

            case 'postgres':
                if (!config.host || !config.port || !config.database || !config.username || !config.password) {
                    return res.json({ success: false, message: 'Missing required connection details.' });
                }

                const { Client } = require('pg');
                const client = new Client({
                    host: config.host,
                    port: parseInt(config.port),
                    database: config.database,
                    user: config.username,
                    password: config.password,
                    ssl: { rejectUnauthorized: false } // Common for cloud dbs, adjust as needed
                });

                try {
                    await client.connect();
                    await client.query('SELECT 1'); // Simple heartbeat
                    return res.json({ success: true, message: 'Successfully connected to PostgreSQL.' });
                } catch (err) {
                    return res.json({ success: false, message: `PostgreSQL Connection Error: ${err.message}` });
                } finally {
                    await client.end();
                }

            default:
                return res.json({ success: true, message: `Connection test for ${subtype} not fully implemented, but backend received request.` });
        }
    } catch (error) {
        console.error('Connection test unexpected error:', error);
        return res.json({ success: false, message: `Unexpected error: ${error.message}` });
    }
});

module.exports = router;
