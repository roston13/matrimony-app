const express = require('express');
const router = express.Router();
const db = require('../db');

// Add or Update Preferences
router.post('/add', (req, res) => {
    const { user_id, preferred_gender, min_age, max_age, preferred_religion, preferred_city } = req.body;

    if (!user_id || !preferred_gender || !min_age || !max_age) {
        return res.status(400).json({ message: 'user_id, preferred_gender, min_age, and max_age are required.' });
    }

    // Check if preferences already exist
    const checkQuery = 'SELECT * FROM preferences WHERE user_id = ?';

    db.query(checkQuery, [user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err });

        if (result.length > 0) {
            // Update existing preferences
            const updateQuery = `
        UPDATE preferences
        SET preferred_gender = ?, min_age = ?, max_age = ?, preferred_religion = ?, preferred_city = ?
        WHERE user_id = ?
      `;

            db.query(
                updateQuery,
                [preferred_gender, min_age, max_age, preferred_religion, preferred_city, user_id],
                (err2) => {
                    if (err2) return res.status(500).json({ error: err2 });
                    res.json({ message: 'Preferences updated successfully' });
                }
            );

        } else {
            // Insert new preferences
            const insertQuery = `
        INSERT INTO preferences (user_id, preferred_gender, min_age, max_age, preferred_religion, preferred_city)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

            db.query(
                insertQuery,
                [user_id, preferred_gender, min_age, max_age, preferred_religion, preferred_city],
                (err2) => {
                    if (err2) return res.status(500).json({ error: err2 });
                    res.json({ message: 'Preferences saved successfully' });
                }
            );
        }
    });
});

// Get Preferences by user_id
router.get('/:user_id', (req, res) => {
    const { user_id } = req.params;

    const query = 'SELECT * FROM preferences WHERE user_id = ?';

    db.query(query, [user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        // Return empty object instead of 404 if no preferences found
        res.json(result[0] || {});
    });
});

module.exports = router;