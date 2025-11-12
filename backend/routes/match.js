const express = require('express');
const router = express.Router();
const db = require('../db');

// Generate matches for a given user
router.post('/generate', (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: 'user_id is required' });
    }

    // 1. Get user preferences
    const prefQuery = `
    SELECT preferred_gender, min_age, max_age, preferred_religion, preferred_city
    FROM preferences
    WHERE user_id = ?
  `;

    db.query(prefQuery, [user_id], (err, prefResult) => {
        if (err) return res.status(500).json({ error: err });
        if (prefResult.length === 0) return res.status(404).json({ message: "Preferences not set" });

        const pref = prefResult[0];

        // 2. Find matching users
        const matchQuery = `
      SELECT p.user_id, p.full_name, p.age, p.gender, p.religion, p.city
      FROM profile p
      WHERE p.gender = ?
      AND p.age BETWEEN ? AND ?
      AND (p.religion = ? OR ? = '')
      AND (p.city = ? OR ? = '')
      AND p.user_id != ?
    `;

        db.query(
            matchQuery,
            [
                pref.preferred_gender,
                pref.min_age,
                pref.max_age,
                pref.preferred_religion, pref.preferred_religion,
                pref.preferred_city, pref.preferred_city,
                user_id
            ],
            (err2, matchResults) => {
                if (err2) return res.status(500).json({ error: err2 });

                if (matchResults.length === 0) {
                    return res.json({ message: "No matches found yet", matches: [] });
                }

                // 3. Insert matches into matches table
                const insertQuery = `
          INSERT IGNORE INTO matches (user_id, matched_user_id, match_score)
          VALUES (?, ?, ?)
        `;

                matchResults.forEach(match => {
                    db.query(insertQuery, [user_id, match.user_id, 100]);
                });

                res.json({
                    message: "Matches generated successfully",
                    matches: matchResults
                });
            }
        );
    });
});

// Get match list
router.get('/:user_id', (req, res) => {
    const user_id = req.params.user_id;

    const query = `
    SELECT m.match_id, u.username, p.full_name, p.age, p.gender, p.city
    FROM matches m
    JOIN users u ON m.matched_user_id = u.user_id
    JOIN profile p ON m.matched_user_id = p.user_id
    WHERE m.user_id = ?
  `;

    db.query(query, [user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
});

module.exports = router;