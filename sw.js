---
permalink: /sw.js
---
/*
 * Service worker per IPUI→IPEI Converter.
 * Precache dello shell statico + stale-while-revalidate per tutto il resto,
 * cosi' il tool (calcolo puramente client-side) resta usabile offline.
 * Il nome della cache cambia ad ogni build, cosi' un deploy invalida
 * automaticamente le versioni precedenti.
 */
var CACHE_NAME = "ipui2ipei-{{ site.time | date: '%s' }}";
var BASE = "{{ site.baseurl }}";

var PRECACHE_URLS = [
  BASE + "/",
  BASE + "/it/",
  BASE + "/en/",
  BASE + "/it/contatti/",
  BASE + "/en/contact/",
  BASE + "/assets/css/main.css",
  BASE + "/assets/js/theme.js",
  BASE + "/assets/js/ipui2ipei.js",
  BASE + "/assets/images/favicon.png",
  BASE + "/assets/images/icon-192.png",
  BASE + "/manifest.webmanifest"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return key !== CACHE_NAME;
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var network = fetch(event.request)
        .then(function (response) {
          if (response && response.ok) {
            var copy = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, copy);
            });
          }
          return response;
        })
        .catch(function () {
          if (cached) return cached;
          if (event.request.mode === "navigate") {
            return caches.match(BASE + "/it/");
          }
        });

      return cached || network;
    })
  );
});
