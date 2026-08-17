source 'https://rubygems.org'

# Jekyll dichiarato direttamente (non tramite la gem "github-pages"): la
# build/pubblicazione passa da un workflow GitHub Actions, quindi le
# versioni le scegliamo noi qui. Stesso schema di skyflash.github.io.
gem "jekyll", "~> 4.3"

# markdown: kramdown, input: GFM (vedi _config.yml).
gem "kramdown-parser-gfm"

# Dart Sass.
gem "jekyll-sass-converter", "~> 3.0"

group :jekyll_plugins do
  gem "jekyll-seo-tag"
  gem "jekyll-redirect-from"
  gem "jekyll-target-blank"
end

# Non è un plugin Jekyll: gira in CI dopo la build per controllare link
# rotti, immagini senza alt, anchor interni non validi.
gem "html-proofer", group: :test

# Ruby 3.4+ stopped shipping these as default gems; Jekyll/Liquid still need them
gem 'logger'
gem 'bigdecimal'

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data"

# Performance-booster for watching directories on Windows. Deve usare
# `platforms:` (meccanismo nativo di Bundler) e non un `if Gem.win_platform?`:
# quest'ultimo viene valutato quando il Gemfile viene letto, quindi su CI
# Linux la gem sparirebbe dal Gemfile mentre resta nel lockfile, mandando in
# conflitto la modalità frozen usata in CI.
gem "wdm", ">= 0.1.0", platforms: [:windows]

gem "webrick"
gem "rack", ">= 2.1.4"
