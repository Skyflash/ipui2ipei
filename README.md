IPUI 2 IPEI
===========
###### by Gorka Hernandez

*IPUI 2 IPEI converts DECT phone IPUI codes to standard IPEI ones, all done in an ETSI compliant process.*

Live at [cristiancastellari.it/ipui2ipei](https://cristiancastellari.it/ipui2ipei/), in Italian and English.

## Sviluppo locale

Richiede Ruby (con Bundler).

```bash
bundle install
bundle exec jekyll serve
```

Il sito serve da `http://127.0.0.1:4000/ipui2ipei/` (non dalla root: `baseurl` è impostato su `/ipui2ipei`, dato che è una project page che eredita il dominio custom del sito principale).

## Changelog

Le modifiche più significative dalla v1.0.0 in poi (la ricostruzione completa in Jekyll 4 bilingue) sono tracciate in [CHANGELOG.md](CHANGELOG.md).

---

### *Version History*

##### v0.1.0 "First Commit"
  * Basic functionality has been implemented.
  * Verbose mode.

##### v0.2.0 "Bootstrapidly Modular!"
  * Rebuilt using Bootstrap v3.2.0
  * JS code has been migrated to an external file.

##### v0.2.1 "Cleaning up the house"
  * Added reset button.
  * Set IPEI (result) input tag to read only.

##### v0.3.0 "Validate NAOW"
  * Form validation is now live and will let the user know at the moment if the input is correct in a visual way.
  * Externalized CSS styles.

##### v0.3.1 "Do you speak Italian?"
  * Very simple italian translation.

##### v0.3.2 "Bigger is better"

  * Boostrap updated to latest 3.x version
  * Upgraded jQuery from 1.x to 3.x
  * Added short instructions on how to get to the hidden service menu
  * Added favicons
  * Simple SEO support (descriptions, meta keywords and h1/h2 tags)

##### v1.0.0 "Bilingual and Bootstrap-free"

  * Rebuilt from scratch on Jekyll 4 + GitHub Actions, no more Bootstrap/jQuery. Full details in [CHANGELOG.md](CHANGELOG.md).