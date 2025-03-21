const db = require('../config/db');

class User {
    static async create(email, username, password) {
        const query = 'INSERT INTO users (email, username, password, is_admin) VALUES (?, ?, ?, ?)';
        await db.query(query, [email, username, password, false]);
    }

    static async findByUsername(username) {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = User;