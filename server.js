const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// CORS aktivieren
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Middleware für JSON-Body
app.use(express.json());

// Beispiel-Daten
let sprueche = [
  { id: 1, text: "Der Weg ist das Ziel.", autor: "Konfuzius" },
  { id: 2, text: "Glaub an dich!", autor: "Unbekannt" }
];

// API: Alle Sprüche holen
app.get('/api/sprueche', (req, res) => {
  res.json(sprueche);
});

// API: Neuen Spruch speichern
app.post('/api/sprueche', (req, res) => {
  const { text, autor } = req.body;
  const neueId = sprueche.length > 0 ? Math.max(...sprueche.map(s => s.id)) + 1 : 1;
  const neuerSpruch = { id: neueId, text, autor };
  sprueche.push(neuerSpruch);
  res.status(201).json(neuerSpruch);
});

// API: Spruch löschen
app.delete('/api/sprueche/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = sprueche.findIndex(s => s.id === id);
  if (index !== -1) {
    sprueche.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Spruch nicht gefunden' });
  }
});

// Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});