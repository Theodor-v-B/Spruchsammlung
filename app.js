const apiBaseUrl = 'http://localhost:3000/api/sprueche';

// Elemente aus dem DOM holen
const spruchAnzeige = document.getElementById('spruch-anzeige');
const btnZufall = document.getElementById('random-spruch-btn');
const formular = document.getElementById('neuer-spruch-form');
const spruchInput = document.getElementById('spruch-input');
const autorInput = document.getElementById('autor-input');
const zeichenZaehler = document.getElementById('zeichen-zaehler');
const spruchListe = document.getElementById('spruch-liste');

let sprueche = []; // Daten werden vom Server geladen

// Zeichen-Zähler bei Eingabe aktualisieren
spruchInput.addEventListener('input', () => {
  zeichenZaehler.textContent = `Zeichen: ${spruchInput.value.length}`;
});

// Funktion: Alle Sprüche vom Server laden
async function fetchSprüche() {
  const response = await fetch(apiBaseUrl);
  if (response.ok) {
    const spruecheVonServer = await response.json();
    sprueche = spruecheVonServer;
    renderSprueche();
  } else {
    console.error('Fehler beim Laden der Sprüche');
  }
}

// Funktion: Alle Sprüche im DOM anzeigen
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

    // Löschen-Button
    const btnLöschen = document.createElement('button');
    btnLöschen.className = 'btn btn-sm btn-danger ms-3';
    btnLöschen.textContent = 'Löschen';
    btnLöschen.onclick = () => {
      deleteSpruch(s.id);
    };

    li.appendChild(btnLöschen);
    spruchListe.appendChild(li);
  });
}

// Funktion: Zufälligen Spruch anzeigen
function zeigeZufaellenSpruch() {
  if (sprueche.length === 0) {
    spruchAnzeige.innerHTML = "<p>Kein Spruch vorhanden.</p>";
    return;
  }
  const index = Math.floor(Math.random() * sprueche.length);
  const spruch = sprueche[index];
  spruchAnzeige.innerHTML = `
    <p>"${spruch.spruch}"</p>
    <footer class="blockquote-footer">${spruch.autor}</footer>
  `;
}

// Funktion: Neuen Spruch auf Server speichern
async function saveSpruch(spruchObjekt) {
  const response = await fetch(apiBaseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spruchObjekt)
  });
  if (response.ok) {
    const neuerSpruch = await response.json();
    sprueche.push(neuerSpruch);
    renderSprueche();
  } else {
    console.error('Fehler beim Speichern des Spruchs');
  }
}

// Funktion: Spruch löschen auf Server
async function deleteSpruch(id) {
  const response = await fetch(`${apiBaseUrl}/${id}`, {
    method: 'DELETE'
  });
  if (response.ok) {
    // Locales Array aktualisieren
    sprueche = sprueche.filter(s => s.id !== id);
    renderSprueche();
  } else {
    console.error('Fehler beim Löschen des Spruchs');
  }
}

// Event: Zufall-Button
btnZufall.addEventListener('click', () => {
  zeigeZufaellenSpruch();
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
  }
});

// Seite beim Start laden
fetchSprüche();