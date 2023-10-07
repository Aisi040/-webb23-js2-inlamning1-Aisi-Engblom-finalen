const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const HIGHSCORE_FILE = path.join(__dirname, 'highscores.json');

app.use(bodyParser.json());

// Lägg till Content Security Policy (CSP) middleware
app.use(function (req, res, next) {
    res.setHeader("Content-Security-Policy", "default-src 'self' http://localhost:3000; img-src 'self' http://localhost:3000");
    return next();
});

// Endpoint för att hantera favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204).send());

// Endpoint för att hämta highscores
app.get('/highscores', (req, res) => {
    if (fs.existsSync(HIGHSCORE_FILE)) {
        const highscores = JSON.parse(fs.readFileSync(HIGHSCORE_FILE, 'utf8'));
        res.json(highscores);
    } else {
        res.json([]);
    }
});

// Endpoint för att lägga till en ny highscore
app.post('/highscores', (req, res) => {
    const newScore = {
        name: req.body.name,
        score: req.body.score
    };

    let highscores = [];

    if (fs.existsSync(HIGHSCORE_FILE)) {
        highscores = JSON.parse(fs.readFileSync(HIGHSCORE_FILE, 'utf8'));
    }

    highscores.push(newScore);

    // Sortera highscores i fallande ordning
    highscores.sort((a, b) => b.score - a.score);

    // Behåll endast topp 5 highscores
    highscores = highscores.slice(0, 5);

    fs.writeFileSync(HIGHSCORE_FILE, JSON.stringify(highscores, null, 2), 'utf8');
    res.json({ status: "success" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
