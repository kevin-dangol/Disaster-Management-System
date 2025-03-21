const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const User = require('../models/user');
const router = express.Router();
const SECRET_KEY = "secret_key";

//verify admin
const verifyAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user || !user.is_admin) {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

//signup
router.post('/signup', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        console.log('Signup request:', { email, username });
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create(email, username, hashedPassword);
        res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

//login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login request:', { username });
        const user = await User.findByUsername(username);
        
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ success: true, message: 'Login successful', token, is_admin: user.is_admin });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

//logout
router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Logout successful' });
});

//check
router.get('/check-session', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.json({ logged_in: false, is_admin: false });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ logged_in: true, is_admin: decoded.is_admin });
    } catch (error) {
        res.json({ logged_in: false, is_admin: false });
    }
});

module.exports = router;
module.exports.verifyAdmin = verifyAdmin;