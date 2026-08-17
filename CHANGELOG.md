# Changelog

Tutte le modifiche rilevanti al sito sono documentate in questo file.

## [1.0.0] - 2026-08-18 — Ricostruzione completa: Jekyll 4, bilingue, niente più Bootstrap

Il tool (fork del 2019 di un progetto di Gorka Hernández, fermo da allora) è stato ricostruito da zero: via Bootstrap 3.2.0 e jQuery, dentro Jekyll 4 con pubblicazione su GitHub Actions — stesso schema appena collaudato su [cristiancastellari.it](https://cristiancastellari.it) — e reso bilingue italiano/inglese. **Vincolo rispettato al 100%: l'URL storico già indicizzato (`https://cristiancastellari.it/ipui2ipei/`) continua a funzionare**, ora come redirect verso `/ipui2ipei/it/`.

### Stack e architettura

- `Gemfile`/`_config.yml`: Jekyll 4.4.1 e Dart Sass dichiarati direttamente (nessuna gem `github-pages`), stesso identico schema di correzioni già scoperto sul sito principale applicato fin da subito — `wdm` dichiarato con `platforms: [:windows]` (non `if Gem.win_platform?`, che rompe la CI Linux) e `Gemfile.lock` generato con entrambe le piattaforme (`bundle lock --add-platform x86_64-linux`) prima del primo push, evitando il giro di errori vissuto la prima volta sul sito principale.
- `baseurl: /ipui2ipei`: a differenza del sito principale (`baseurl: ''`), questo è una project page che eredita il dominio custom — ogni asset/link passa dal filtro `relative_url`/`absolute_url` per restare coerente sotto quel prefisso, verificato sia in build sia in `jekyll serve` locale.
- Bilingue con pagine separate `/it/` e `/en/` (non uno switcher client-side, per SEO — la maggior parte del traffico arriva da ricerca organica per lo strumento): `_includes/i18n-alternates.html` (hreflang, porting dal sito principale) collega le due pagine via `translation_key`, con un `hreflang="x-default"` aggiuntivo verso `/it/`.
- Redirect dalla vecchia root: `it/index.html` ha `permalink: /it/` e `redirect_from: /` (via `jekyll-redirect-from`, baseurl-aware) — lo stub generato punta correttamente a `https://cristiancastellari.it/ipui2ipei/it/`.
- Due workflow GitHub Actions: `build-check.yml` (build + `html-proofer` su ogni push/PR) e `pages.yml` (build + deploy, **senza** il cron giornaliero del sito principale — qui non c'è contenuto postdatato da pubblicare da solo).

### L'algoritmo di conversione, riscritto senza cambiare un solo bit di output

`assets/js/ipui2ipei.js`: via jQuery e le variabili globali implicite del codice originale (`ipuiFirst`, `checkDigit`, ecc., mai dichiarate con `var`), sostituito con una IIFE pulita. **La matematica non è cambiata**: stesso scarto del primo carattere, stesso split EMC (4 hex, 16 bit) / PSN (resto, 20 bit), stesso zero-padding a 5/7 cifre, stesso checksum ETSI EN 300 175-6 Allegato C (somma pesata mod 11, `*` se il risultato è 10).

- **Verifica di parità**: scritto un harness Node a parte che esegue in parallelo l'algoritmo originale (trascritto tale e quale) e quello nuovo su un set di IPUI di test — inclusi un input che produce checksum modulo esattamente 10 (per il ramo `*`, trovato per forza bruta) e il limite esatto di validazione (9 caratteri). Output identico su tutti i casi, poi riconfermato end-to-end in un vero browser headless (Edge, con la form compilata e inviata via script) prima di considerare la riscrittura affidabile.
- Validazione dell'IPUI: l'`alert()` bloccante diventa uno stato inline (bordo colorato + messaggio con `aria-live`), soglia di validazione (`< 9` caratteri) invariata.
- Bottone "Converti" diventato `type="submit"`: premendo Invio nel campo IPUI la conversione parte da sola, senza dover cliccare — comportamento nativo del form, non un listener sul tasto gestito a mano.

### Bug scovati durante la riscrittura

- Il loop Liquid delle 8 dimensioni di apple-touch-icon (`{% for size in "57,72,..." | split: "," %}`) non applicava lo split *prima* di entrare nel ciclo: girava una sola volta con l'intera stringa come valore, generando un unico link con un filename illeggibile invece di 8 tag separati. Corretto con un `assign` esplicito prima del `for`. Bug presente fin dalla prima stesura, notato solo controllando l'HTML generato per la nuova pagina Contatti.

### Design: dalla proposta iniziale alla palette definitiva

Prima proposta (ambra, identità totalmente indipendente dal sito principale) rivista dopo un giro di feedback:

- **Bottone "Converti" e bordo di validazione dell'IPUI restano verdi** in entrambi i temi (`--color-success`, indipendente dal resto) — richiamo diretto al vecchio `btn-success`/`has-success` di Bootstrap, l'unica cosa della palette originale che doveva sopravvivere.
- **Testo ed evidenziazioni**: blu (identico a `#3385ff` di cristiancastellari.it) sul tema chiaro, arancione Gigaset (stima da screenshot del logo, nessun hex ufficiale reperibile online) sul tema scuro — un nod al mondo DECT di cui parla lo strumento.
- Card allargata da 640px a 760px (non era una scelta legata al mobile, solo estetica — la responsività viene dal layout fluido, indipendente dalla larghezza massima).
- Riallineato bottone "Converti" e campo IPUI: il messaggio di errore (anche vuoto) allungava solo la colonna dell'input, spostato fuori dalla riga flessibile.
- **Gerarchia visiva di stato attivo invertita**: nello switcher lingua (IT/EN) e nel nav Convertitore/Contatti, l'elemento su cui ti trovi ora è un pill con sfondo ed evidenziazione (sembra "sei qui"), quello cliccabile resta discreto e si accende solo al passaggio del mouse — la prima versione faceva l'esatto contrario (il link colorato sembrava quello attivo).
- Aggiunto un bottone "Torna al sito" nel footer, verso `cristiancastellari.it/{lingua corrente}/`.

### Nuova pagina Contatti/Contact

Replica la struttura di quella del sito principale (lead + griglia di card, una per canale), adattata:

- Card grid con icone SVG disegnate a mano (busta, "in" LinkedIn, octocat GitHub, X, farfalla Bluesky, "f" Facebook) invece di Fork Awesome, per non reintrodurre un font di icone in un sito che l'aveva volutamente eliminato con tutto il resto di Bootstrap.
- Nuovo blocco `author:` in `_config.yml`, stessi dati di contatto del sito principale.
- Nav "Convertitore ↔ Contatti" aggiunto in cima a ogni pagina — mancava un modo di tornare al tool dalla pagina Contatti, sistemato con lo stesso pattern pill già usato per lo switcher lingua.
- Saluto personale come H1 della pagina ("Ciao, sono Cristian!" / "It's-a me, Cristian!", omaggio a Mario) al posto di un H1 "Contatti" separato: due titoli impilati (uno grande sopra, uno più piccolo sotto) erano visivamente scorretti; il `<title>`/meta description restano "Contatti" per la SEO, cambia solo il testo visibile in pagina. **Stessa idea da riportare, prima o poi, sulla pagina Contatti del sito principale.**
- Copyright corretto: restava fermo al 2014 dell'autore originale. Ora `{{ site.time | date: "%Y" }}` per l'anno del fork, con crediti separati a Gorka Hernández (opera originale, 2014) e Cristian Castellari (fork e riscrittura).
- `robots.txt`: tolto il `Disallow` su `/css/`, `/js/`, `/fonts/` (bloccava Googlebot dal render della pagina — con Bootstrap/jQuery/glyphicon spariti, quei percorsi non hanno più senso comunque). Conservata l'ASCII art di Batman in fondo al file.

### Pulizia

Rimossi definitivamente: `css/bootstrap.min.css`, `js/bootstrap.min.js`, il riferimento CDN a jQuery, i 5 file webfont dei glyphicon Bootstrap, `package-lock.json` (elencava solo `bootstrap@3.4.0`, nessun `package.json` è mai esistito nel repo), `ipui2ipei.code-workspace`. Tutte le immagini (favicon, apple-touch-icon, `og.png`) restano invariate.
