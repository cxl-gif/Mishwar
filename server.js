// Express Server for Mishwar API

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize Database
const db = new sqlite3.Database('./database.sqlite');

// Create tables
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        userType TEXT NOT NULL,
        phone TEXT,
        location TEXT,
        avatar TEXT,
        bio TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Companies table
    db.run(`CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        userId TEXT UNIQUE NOT NULL,
        companyName TEXT NOT NULL,
        industry TEXT,
        website TEXT,
        size TEXT,
        description TEXT,
        FOREIGN KEY (userId) REFERENCES users(id)
    )`);

    // Freelances table
    db.run(`CREATE TABLE IF NOT EXISTS freelances (
        id TEXT PRIMARY KEY,
        userId TEXT UNIQUE NOT NULL,
        specialties TEXT,
        hourlyRate REAL,
        dailyRate REAL,
        availability TEXT,
        experience INTEGER,
        languages TEXT,
        rating REAL DEFAULT 0,
        totalReviews INTEGER DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id)
    )`);

    // Projects table
    db.run(`CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        clientId TEXT NOT NULL,
        freelancerId TEXT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        contentType TEXT NOT NULL,
        budget REAL,
        status TEXT DEFAULT 'PENDING',
        deadline DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clientId) REFERENCES users(id),
        FOREIGN KEY (freelancerId) REFERENCES freelances(id)
    )`);

    // Portfolio items table
    db.run(`CREATE TABLE IF NOT EXISTS portfolio_items (
        id TEXT PRIMARY KEY,
        freelanceId TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        mediaUrl TEXT NOT NULL,
        thumbnailUrl TEXT,
        tags TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (freelanceId) REFERENCES freelances(id)
    )`);

    // Reviews table
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        projectId TEXT UNIQUE NOT NULL,
        reviewerId TEXT NOT NULL,
        reviewedId TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (projectId) REFERENCES projects(id),
        FOREIGN KEY (reviewerId) REFERENCES users(id),
        FOREIGN KEY (reviewedId) REFERENCES users(id)
    )`);

    // Messages table
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        projectId TEXT NOT NULL,
        senderId TEXT NOT NULL,
        receiverId TEXT NOT NULL,
        content TEXT NOT NULL,
        read INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (projectId) REFERENCES projects(id),
        FOREIGN KEY (senderId) REFERENCES users(id),
        FOREIGN KEY (receiverId) REFERENCES users(id)
    )`);

    // Resources table
    db.run(`CREATE TABLE IF NOT EXISTS resources (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        category TEXT,
        published INTEGER DEFAULT 0,
        views INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Helper function to generate ID
function generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Auth Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'غير مصرح' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'رمز غير صالح' });
        }
        req.user = user;
        next();
    });
}

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, userType, phone, location, companyName } = req.body;

        if (!name || !email || !password || !userType) {
            return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
        }

        // Check if user exists
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'خطأ في قاعدة البيانات' });
            }
            if (row) {
                return res.status(400).json({ error: 'البريد الإلكتروني مستخدم بالفعل' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = generateId();

            // Create user
            db.run('INSERT INTO users (id, email, password, name, userType, phone, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, email, hashedPassword, name, userType, phone || null, location || null],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: 'خطأ في إنشاء المستخدم' });
                    }

                    // Create company or freelance
                    if (userType === 'COMPANY') {
                        const companyId = generateId();
                        db.run('INSERT INTO companies (id, userId, companyName) VALUES (?, ?, ?)',
                            [companyId, userId, companyName || name]);
                    } else {
                        const freelanceId = generateId();
                        db.run('INSERT INTO freelances (id, userId) VALUES (?, ?)',
                            [freelanceId, userId]);
                    }

                    res.status(201).json({ message: 'تم إنشاء الحساب بنجاح' });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء التسجيل' });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, userType: user.userType },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                userType: user.userType
            }
        });
    });
});

// Freelances Routes
app.get('/api/freelances', (req, res) => {
    db.all(`SELECT f.*, u.name, u.email, u.avatar, u.bio, u.location 
            FROM freelances f 
            JOIN users u ON f.userId = u.id 
            LIMIT 50`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'خطأ في قاعدة البيانات' });
        }
        res.json({ freelances: rows.map(row => ({
            ...row,
            specialties: row.specialties ? JSON.parse(row.specialties) : [],
            _count: { portfolio: 0, projects: 0 }
        })) });
    });
});

app.get('/api/freelances/search', (req, res) => {
    const { contentType, location, minRating, maxRate, search } = req.query;
    
    let query = `SELECT f.*, u.name, u.email, u.avatar, u.bio, u.location 
                 FROM freelances f 
                 JOIN users u ON f.userId = u.id 
                 WHERE 1=1`;
    const params = [];

    if (contentType) {
        query += ` AND f.specialties LIKE ?`;
        params.push(`%${contentType}%`);
    }
    if (location) {
        query += ` AND u.location LIKE ?`;
        params.push(`%${location}%`);
    }
    if (minRating) {
        query += ` AND f.rating >= ?`;
        params.push(minRating);
    }
    if (maxRate) {
        query += ` AND (f.hourlyRate <= ? OR f.dailyRate <= ?)`;
        params.push(maxRate, maxRate);
    }
    if (search) {
        query += ` AND (u.name LIKE ? OR u.bio LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    query += ` LIMIT 50`;

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'خطأ في البحث' });
        }
        res.json({ freelances: rows.map(row => ({
            ...row,
            specialties: row.specialties ? JSON.parse(row.specialties) : [],
            _count: { portfolio: 0, projects: 0 }
        })) });
    });
});

// Dashboard Routes
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
    const userId = req.user.id;
    
    db.get('SELECT userType FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) {
            return res.status(500).json({ error: 'خطأ في قاعدة البيانات' });
        }

        if (user.userType === 'COMPANY') {
            db.get('SELECT COUNT(*) as count FROM projects WHERE clientId = ?', [userId], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: 'خطأ في قاعدة البيانات' });
                }
                res.json({ projects: row.count, portfolio: 0, reviews: 0 });
            });
        } else {
            db.get('SELECT COUNT(*) as projects FROM projects WHERE freelancerId IN (SELECT id FROM freelances WHERE userId = ?)', [userId], (err, projectsRow) => {
                db.get('SELECT COUNT(*) as portfolio FROM portfolio_items WHERE freelanceId IN (SELECT id FROM freelances WHERE userId = ?)', [userId], (err, portfolioRow) => {
                    db.get('SELECT COUNT(*) as reviews FROM reviews WHERE reviewedId = ?', [userId], (err, reviewsRow) => {
                        res.json({
                            projects: projectsRow?.projects || 0,
                            portfolio: portfolioRow?.portfolio || 0,
                            reviews: reviewsRow?.reviews || 0
                        });
                    });
                });
            });
        }
    });
});

// Projects Routes
app.get('/api/projects', authenticateToken, (req, res) => {
    const userId = req.user.id;
    
    db.get('SELECT userType FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) {
            return res.status(500).json({ error: 'خطأ في قاعدة البيانات' });
        }

        let query = 'SELECT * FROM projects WHERE ';
        if (user.userType === 'COMPANY') {
            query += 'clientId = ?';
        } else {
            query += 'freelancerId IN (SELECT id FROM freelances WHERE userId = ?)';
        }
        query += ' ORDER BY createdAt DESC';

        db.all(query, [userId], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'خطأ في قاعدة البيانات' });
            }
            res.json({ projects: rows });
        });
    });
});

app.post('/api/projects', authenticateToken, (req, res) => {
    const { title, description, contentType, budget, deadline, freelancerId } = req.body;
    const userId = req.user.id;

    db.get('SELECT userType FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user || user.userType !== 'COMPANY') {
            return res.status(403).json({ error: 'غير مصرح' });
        }

        const projectId = generateId();
        db.run('INSERT INTO projects (id, clientId, freelancerId, title, description, contentType, budget, status, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [projectId, userId, freelancerId || null, title, description, JSON.stringify(Array.isArray(contentType) ? contentType : [contentType]), budget || null, freelancerId ? 'IN_PROGRESS' : 'PENDING', deadline || null],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'خطأ في إنشاء المشروع' });
                }
                res.status(201).json({ project: { id: projectId, ...req.body } });
            }
        );
    });
});

// Resources Routes
app.get('/api/resources', (req, res) => {
    const { type } = req.query;
    
    let query = 'SELECT * FROM resources WHERE published = 1';
    const params = [];
    
    if (type && type !== 'all') {
        query += ' AND type = ?';
        params.push(type);
    }
    
    query += ' ORDER BY createdAt DESC';
    
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'خطأ في قاعدة البيانات' });
        }
        res.json({ resources: rows });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

