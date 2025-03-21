const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const disasterRoutes = require('./routes/disasters');
const db = require('./config/db');

const app = express();

app.use(cors({ 
    credentials: true, 
    origin: 'http://127.0.0.1:5501'
}));
app.use(express.json());
app.use(express.static('../'));

app.use('/api/auth', authRoutes);
app.use('/api/disasters', disasterRoutes);

db.getConnection()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection failed:', err));

app.listen(3001, () => {
    console.log('Server running on port 3001');
});