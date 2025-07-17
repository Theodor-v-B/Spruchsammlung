const express = require('express');
const app = express();
const port = 3000;
const path = require('path'); // Pfadmodul zum sicheren Pfad

// CORS aktivieren
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json()); // JSON-Body Parsing

// API: Alle Sprüche holen
app.get('/api/sprueche', (req, res) => {
  res.json(sprueche);
});

// API: Neuen Spruch erstellen
app.post('/api/sprueche', (req, res) => {
  const { spruch, autor } = req.body;
  const neueId = sprueche.length ? Math.max(...sprueche.map(s => s.id)) + 1 : 1;
  const neuerSpruch = { id: neueId, spruch, autor };
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

// Route für die Webseite (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});