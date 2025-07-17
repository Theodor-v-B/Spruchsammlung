// Beim Laden aus LocalStorage holen, falls vorhanden
const gespeicherteSprüche = localStorage.getItem('sprueche');
if (gespeicherteSprüche) {
    sprueche = JSON.parse(gespeicherteSprüche);
}

// Elemente aus dem HTML greifen
const spruchAnzeige = document.getElementById('spruch-anzeige');
const randomSpruchBtn = document.getElementById('random-spruch-btn');
const neuesSpruchForm = document.getElementById('neuer-spruch-form');
const spruchInput = document.getElementById('spruch-input');
const autorInput = document.getElementById('autor-input');
const spruchListe = document.getElementById('spruch-liste');
const zeichenZaehler = document.getElementById('zeichen-zaehler');

// Zeichen-Zähler bei Eingabe
spruchInput.addEventListener('input', () => {
    const zeichenzahl = spruchInput.value.length;
    zeichenZaehler.textContent = `Zeichen: ${zeichenzahl}`;
});

// Funktion: Sprüche anzeigen
function renderSprueche() {
    spruchListe.innerHTML = '';
    sprueche.forEach((spruch, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap';

        // Inhalt
        li.innerHTML = `
            <div>
                <p class="mb-1">"${spruch.text}"</p>
                <small class="text-muted fst-italic">- ${spruch.autor}</small>
            </div>
        `;

        // Löschen-Button
        const btnLöschen = document.createElement('button');
        btnLöschen.className = 'btn btn-sm btn-danger ms-2';
        btnLöschen.textContent = 'Löschen';
        btnLöschen.onclick = () => {
            sprueche.splice(index, 1);
            localStorage.setItem('sprueche', JSON.stringify(sprueche));
            renderSprueche();
            zeigeZufaelligenSpruch();
        };

        li.appendChild(btnLöschen);
        spruchListe.appendChild(li);
    });
}

// Zufalls-Spruch
randomSpruchBtn.addEventListener('click', () => {
    if (sprueche.length === 0) return;
    const index = Math.floor(Math.random() * sprueche.length);
    const spruch = sprueche[index];
    spruchAnzeige.innerHTML = `
        <p>"${spruch.text}"</p>
        <footer class="blockquote-footer">${spruch.autor}</footer>
    `;
});

// Formular für neuen Spruch
neuesSpruchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = spruchInput.value.trim();
    const autor = autorInput.value.trim();
    if (text && autor) {
        sprueche.push({ text, autor });
        localStorage.setItem('sprueche', JSON.stringify(sprueche));
        renderSprueche();
        neuesSpruchForm.reset();
        zeichenZaehler.textContent = 'Zeichen: 0';
        zeigeZufaelligenSpruch();
    }
});

// Beim Laden die Liste initialisieren
renderSprueche();