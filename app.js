// Beim Laden: Sprüche aus LocalStorage holen oder initial setzen
let sprueche = [];
const gespeicherteSprüche = localStorage.getItem('sprueche');
if (gespeicherteSprüche) {
  sprueche = JSON.parse(gespeicherteSprüche);
}

// Elemente aus dem DOM holen
const spruchAnzeige = document.getElementById('spruch-anzeige');
const btnZufall = document.getElementById('random-spruch-btn');
const formular = document.getElementById('neuer-spruch-form');
const spruchInput = document.getElementById('spruch-input');
const autorInput = document.getElementById('autor-input');
const zeichenZaehler = document.getElementById('zeichen-zaehler');
const spruchListe = document.getElementById('spruch-liste');

// Zeichen-Zähler bei Eingabe aktivieren
spruchInput.addEventListener('input', () => {
  zeichenZaehler.textContent = `Zeichen: ${spruchInput.value.length}`;
});

// Funktion: Zufällig einen Spruch anzeigen
function zeigeZufaelligenSpruch() {
  if (sprueche.length === 0) {
    spruchAnzeige.innerHTML = "<p>Kein Spruch vorhanden.</p>";
    return;
  }
  const index = Math.floor(Math.random() * sprueche.length);
  const spruch = sprueche[index];
  spruchAnzeige.innerHTML = `
    <p>"${spruch.text}"</p>
    <footer class="blockquote-footer">${spruch.autor}</footer>
  `;
}

// Funktion: Alle Sprüche in der Liste anzeigen
function renderSprueche() {
  spruchListe.innerHTML = '';
  sprueche.forEach((s, i) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap';

    li.innerHTML = `
      <div>
        <p class="mb-1">"${s.text}"</p>
        <small class="text-muted fst-italic">- ${s.autor}</small>
      </div>
    `;

    // Löschen-Button für jeden Spruch
    const btnLöschen = document.createElement('button');
    btnLöschen.className = 'btn btn-sm btn-danger ms-3';
    btnLöschen.textContent = 'Löschen';
    btnLöschen.onclick = () => {
      sprueche.splice(i, 1);
      localStorage.setItem('sprueche', JSON.stringify(sprueche));
      renderSprueche();
      zeigeZufaelligenSpruch();
    };

    li.appendChild(btnLöschen);
    spruchListe.appendChild(li);
  });
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
    sprueche.push({ text, autor });
    localStorage.setItem('sprueche', JSON.stringify(sprueche));
    renderSprueche();
    formular.reset();
    zeichenZaehler.textContent = 'Zeichen: 0';
    zeigeZufaellenSpruch();
  }
});

// Bei Seitenstart: Liste rendern
renderSprueche();
// Zufälligen Spruch anzeigen
zeigeZufaellenSpruch();