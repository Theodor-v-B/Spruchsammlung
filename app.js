// Array für Sprüche, beim Laden aus LocalStorage holen
let sprueche = [];
const gespeicherteSprues = localStorage.getItem('sprueche');
if (gespeicherteSprues) {
  sprueche = JSON.parse(gespeicherteSprues);
}

// Referenzen zu Elementen
const spruchAnzeige = document.getElementById('spruch-anzeige');
const btnZufaellig = document.getElementById('random-spruch-btn');
const listeContainer = document.getElementById('spruch-liste');
const formular = document.getElementById('neuer-spruch-form');
const inputSpruch = document.getElementById('spruch-input');
const inputAutor = document.getElementById('autor-input');

// Funktion: Zufällig einen Spruch anzeigen
function zeigeZufaelligenSpruch() {
  if (sprueche.length === 0) {
    spruchAnzeige.innerHTML = "<p>Kein Spruch vorhanden.</p>";
    return;
  }
  const index = Math.floor(Math.random() * sprueche.length);
  const s = sprueche[index];
  spruchAnzeige.innerHTML = `<p>"${s.spruch}"</p><footer class="blockquote-footer">${s.autor}</footer>`;
}

// Funktion: Alle Sprüche in der Liste anzeigen
function aktualisiereListe() {
  listeContainer.innerHTML = "";
  sprueche.forEach((s, i) => {
    const li = document.createElement('li');
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `"${s.spruch}" <br><small class="text-muted">- ${s.autor}</small>`;
    
    // Löschen-Button
    const btnLöschen = document.createElement('button');
    btnLöschen.className = "btn btn-sm btn-danger";
    btnLöschen.textContent = "Löschen";
    btnLöschen.onclick = () => {
      sprueche.splice(i, 1);
      aktualisiereListe();
      zeigeZufaelligenSpruch();

      // Aktualisiere LocalStorage nach Löschen
      localStorage.setItem('sprueche', JSON.stringify(sprueche));
    };

    li.appendChild(btnLöschen);
    listeContainer.appendChild(li);
  });
}

// Event: Button für Zufallsspruch
btnZufaellig.addEventListener('click', () => {
  zeigeZufaelligenSpruch();
});

// Event: Formular zum Hinzufügen
formular.addEventListener('submit', (e) => {
  e.preventDefault();

  const spruchText = inputSpruch.value.trim();
  const autorText = inputAutor.value.trim();

  if (spruchText && autorText) {
    sprueche.push({ spruch: spruchText, autor: autorText });
    // Formular zurücksetzen
    inputSpruch.value = '';
    inputAutor.value = '';

    // Liste aktualisieren
    aktualisiereListe();

    // Spruch des Tages aktualisieren
    zeigeZufaelligenSpruch();

    // Aktualisiere LocalStorage nach neuem Spruch
    localStorage.setItem('sprueche', JSON.stringify(sprueche));
  }
});