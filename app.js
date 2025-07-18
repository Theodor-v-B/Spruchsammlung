const apiBaseUrl = 'http://localhost:3000/api/sprueche';

// DOM-Elemente holen
const spruchAnzeige = document.getElementById('spruch-anzeige');
const btnZufall = document.getElementById('random-spruch-btn');
const formular = document.getElementById('neuer-spruch-form');
const spruchInput = document.getElementById('spruch-input');
const autorInput = document.getElementById('autor-input');
const zeichenZaehler = document.getElementById('zeichen-zaehler');
const spruchListe = document.getElementById('spruch-liste');

let sprueche = [];

// Zeichen zählen bei Eingabe
spruchInput.addEventListener('input', () => {
  zeichenZaehler.textContent = `Zeichen: ${spruchInput.value.length}`;
});

// API: Alle Sprüche laden
async function fetchSprüche() {
  try {
    const response = await fetch('http://localhost:3000/api/sprueche');
    if (response.ok) {
      sprueche = await response.json();
      renderSprueche();
    } else {
      console.error('Fehler beim Laden der Sprüche:', response.status);
    }
  } catch (err) {
    console.error('Netzwerkfehler beim Laden:', err);
  }
}

// Alle Sprüche im DOM anzeigen
function renderSprueche() {
  spruchListe.innerHTML = '';
  sprueche.forEach(s => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap';

    li.innerHTML = `
      <div>
        <p class="mb-1">"${s.spruch}"</p>
        <small class="text-muted fst-italic">- ${s.autor}</small>
      </div>
    `;

    // Löschen Button
    const btnLöschen = document.createElement('button');
    btnLöschen.className = 'btn btn-sm btn-danger ms-3';
    btnLöschen.textContent = 'Löschen';
    btnLöschen.onclick = () => deleteSpruch(s.id);

    li.appendChild(btnLöschen);
    spruchListe.appendChild(li);
  });
}

// Zufälligen Spruch holen (Bonus)
async function fetchRandomSpruch() {
  try {
    const response = await fetch('http://localhost:3000/api/sprueche/random');
    if (response.ok) {
      const spruch = await response.json();
      // "Spruch des Tages" aktualisieren
      spruchAnzeige.innerHTML = `
        <p>"${spruch.spruch}"</p>
        <footer class="blockquote-footer">${spruch.autor}</footer>
      `;
    }
  } catch (err) {
    console.error('Fehler beim Laden des Zufalls-Spruchs:', err);
  }
}

// Neue Sprüche auf Server speichern
async function saveSpruch(spruch) {
  try {
    const response = await fetch('http://localhost:3000/api/sprueche', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spruch),
    });
    if (response.ok) {
      const neuerSpruch = await response.json();
      sprueche.push(neuerSpruch);
      renderSprueche();
    } else {
      console.error('Fehler beim Speichern:', response.status);
    }
  } catch (err) {
    console.error('Netzwerkfehler beim Speichern:', err);
  }
}

// Spruch löschen
async function deleteSpruch(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/sprueche/${id}`, { method: 'DELETE' });
    if (response.ok) {
      // Im lokalen Array entfernen
      sprueche = sprueche.filter(s => s.id !== id);
      renderSprueche();
    } else {
      console.error('Fehler beim Löschen:', response.status);
    }
  } catch (err) {
    console.error('Netzwerkfehler beim Löschen:', err);
  }
}

// Event: Zufallsspruch anzeigen
btnZufall.addEventListener('click', () => {
  fetchRandomSpruch();
});

// Event: Formular zum Hinzufügen
formular.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = spruchInput.value.trim();
  const autor = autorInput.value.trim();

  if (text && autor) {
    saveSpruch({ spruch: text, autor: autor });
    formular.reset();
    zeichenZaehler.textContent = 'Zeichen: 0';
    // Optional: direkt den Spruch vom Tag aktualisieren
    // fetchRandomSpruch();
  }
});

// Bei Seitenstart alle Sprüche laden
fetchSprüche();