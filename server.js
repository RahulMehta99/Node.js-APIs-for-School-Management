// server.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { body, query, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
app.use(express.json());

// --- Supabase Client Initialization ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


// --- Haversine Distance Calculation Helper (This function does not change) ---
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// --- API Endpoints ---

/**
 * @route   POST /addSchool
 * @desc    Add a new school to the Supabase database
 * @access  Public
 */
app.post('/addSchool',
    // Input validation (This does not change)
    [
        body('name').notEmpty().withMessage('School name is required.'),
        body('address').notEmpty().withMessage('Address is required.'),
        body('latitude').isFloat({ min: -90, max: 90 }).withMessage('A valid latitude (-90 to 90) is required.'),
        body('longitude').isFloat({ min: -180, max: 180 }).withMessage('A valid longitude (-180 to 180) is required.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, address, latitude, longitude } = req.body;

        try {
            // Use the Supabase client to insert data
            const { data, error } = await supabase
                .from('schools')
                .insert([{ name, address, latitude, longitude }])
                .select()
                .single(); // .single() returns the object directly instead of an array

            if (error) {
                // If Supabase returns an error, throw it to be caught by the catch block
                throw error;
            }

            res.status(201).json({
                message: 'School added successfully!',
                school: data
            });
        } catch (error) {
            console.error('Supabase Error:', error.message);
            res.status(500).json({ error: 'Failed to add school to the database.', details: error.message });
        }
    }
);

/**
 * @route   GET /listSchools
 * @desc    Get all schools from Supabase sorted by proximity
 * @access  Public
 */
app.get('/listSchools',
    // Query parameter validation (This does not change)
    [
        query('userLat').isFloat({ min: -90, max: 90 }).withMessage('A valid user latitude (userLat) is required.'),
        query('userLon').isFloat({ min: -180, max: 180 }).withMessage('A valid user longitude (userLon) is required.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userLat, userLon } = req.query;

        try {
            // Use the Supabase client to select all rows
            const { data: schools, error } = await supabase
                .from('schools')
                .select('*');

            if (error) {
                throw error;
            }

            if (schools.length === 0) {
                return res.json([]);
            }

            // The distance calculation and sorting logic is exactly the same
            const schoolsWithDistance = schools.map(school => ({
                ...school,
                distance_km: getDistance(userLat, userLon, school.latitude, school.longitude)
            }));

            schoolsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

            res.json(schoolsWithDistance);

        } catch (error) {
            console.error('Supabase Error:', error.message);
            res.status(500).json({ error: 'Failed to retrieve schools.', details: error.message });
        }
    }
);

// --- Server Start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌍 Server running on http://localhost:${PORT}`);
});