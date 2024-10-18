const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const dbPath = path.resolve(__dirname, "highscores.db");

// Middleware. Needed for access. Allows CORS requests.
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database. Create database scheme if it doesn't exist.
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database", err.message);
    } else {
        console.log("Connected to SQLite database");
        db.run(`CREATE TABLE IF NOT EXISTS highscores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            time INTEGER
        )`);
    }
});

// Get high scores. Actual query. Limit to 10
app.get("/highscores", (req, res) => {
    db.all(
        "SELECT * FROM highscores ORDER BY time ASC LIMIT 10",
        [],
        (err, rows) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json(rows);
        }
    );
});

// Add a new high score
app.post("/highscores", (req, res) => {
    const { name, time } = req.body;
    db.run(
        "INSERT INTO highscores (name, time) VALUES (?, ?)",
        [name, time],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({
                id: this.lastID,
                name,
                time,
            });
        }
    );
});

// Health check endpoint to verify database connection
app.get("/health", (req, res) => {
    db.get("SELECT 1", [], (err) => {
        if (err) {
            res.status(500).json({ error: "Database not connected" });
        } else {
            res.status(200).json({ message: "Database connected" });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
