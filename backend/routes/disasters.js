const express = require('express');
const db = require('../config/db');
const { verifyAdmin } = require('./auth');
const router = express.Router();

//disaster stats
router.get('/stats', async (req, res) => {
    try {
        const stats = {
            recent: [
                { type: 'earthquakes', count: 5 },
                { type: 'landslides', count: 3 },
                { type: 'floods', count: 7 },
                { type: 'wildfires', count: 4 }
            ],
            week: [
                { type: 'earthquakes', count: 12 },
                { type: 'landslides', count: 8 },
                { type: 'floods', count: 15 },
                { type: 'wildfires', count: 9 }
            ],
            year: [
                { type: 'earthquakes', count: 47 },
                { type: 'landslides', count: 31 },
                { type: 'floods', count: 62 },
                { type: 'wildfires', count: 38 }
            ]
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//notifications
router.get('/events', async (req, res) => {
    try {
        const events = [
            { type: 'Earthquake', location: 'California, USA', latitude: 34.0522, longitude: -118.2437, severity: 'High', timestamp: '10 mins ago'},
            { type: 'Flood', location: 'Mumbai, India', latitude: 19.0760, longitude: 72.8777, severity: 'Moderate', timestamp: '15 mins ago'},
            { type: 'Wildfire', location: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093, severity: 'Severe', timestamp: '20 mins ago'},
            { type: 'Landslide', location: 'Himalayas, Nepal', latitude: 27.7172, longitude: 85.3240, severity: 'Low', timestamp: '25 mins ago'}
        ];

        //sends the notif every min
        const lastEventTime = new Date(events[0].timestamp).getTime();
        const now = Date.now();
        if (now - lastEventTime > 60 * 1000) {
            events.unshift({
                type: 'Earthquake',
                location: 'Tokyo, Japan',
                latitude: 35.6762,
                longitude: 139.6503,
                severity: 'Critical',
                timestamp: '5 mins ago'
            });
        }

        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//emergancy contats
router.get('/contacts', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM emergency_contacts');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//add contacts
router.post('/contacts', verifyAdmin, async (req, res) => {
    try {
        const { name, type, phone } = req.body;
        if (!name || !type || !phone) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const query = 'INSERT INTO emergency_contacts (name, type, phone) VALUES (?, ?, ?)';
        await db.query(query, [name, type, phone]);
        res.json({ success: true, message: 'Contact added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

//update contacts
router.put('/contacts/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, phone } = req.body;
        if (!name || !type || !phone) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const query = 'UPDATE emergency_contacts SET name = ?, type = ?, phone = ? WHERE id = ?';
        const [result] = await db.query(query, [name, type, phone, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.json({ success: true, message: 'Contact updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

//delete contacts
router.delete('/contacts/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM emergency_contacts WHERE id = ?';
        const [result] = await db.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;