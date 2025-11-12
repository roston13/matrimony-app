const express = require('express');
const router = express.Router();
const db = require('../db');

// Add or update profile
router.post('/add', (req, res) => {
    const { user_id, full_name, age, gender, religion, caste, occupation, city } = req.body;

    // Check if profile exists
    const checkQuery = 'SELECT * FROM profile WHERE user_id=?';
    db.query(checkQuery, [user_id], (err, result) => {
        if (err) return res.status(500).send(err);

        if (result.length > 0) {
            // ✅ FIXED: SQL keyword must be in quotes
            const updateQuery = 'UPDATE profile SET full_name=?, age=?, gender=?, religion=?, caste=?, occupation=?, city=? WHERE user_id=?';
            db.query(updateQuery, [full_name, age, gender, religion, caste, occupation, city, user_id], (err, result) => {
                if (err) return res.status(500).send(err);
                res.json({ message: 'Profile updated successfully' });
            });
        } else {
            // ✅ FIXED: SQL keyword must be in quotes
            const insertQuery = 'INSERT INTO profile (user_id, full_name, age, gender, religion, caste, occupation, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(insertQuery, [user_id, full_name, age, gender, religion, caste, occupation, city], (err, result) => {
                if (err) return res.status(500).send(err);
                res.json({ message: 'Profile created successfully' });
            });
        }
    });
});

// Get profile by user_id
router.get('/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    const query = 'SELECT * FROM profile WHERE user_id=?';
    db.query(query, [user_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result[0] || {});
    });
});

module.exports = router;