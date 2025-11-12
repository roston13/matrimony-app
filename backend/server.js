const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const preferenceRoutes = require('./routes/preferences');
const matchRoutes = require('./routes/match');

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/match', matchRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));