// sw.js
self.addEventListener('install', e => {
    e.waitUntil(
      caches.open('campus-nav').then(cache => cache.addAll([
        '/',
        '/index.html',
        '/leaflet-map.js',
        '/routing.js',
        '/style.css',
        '/data/boundary.geojson',
        '/data/buildings.geojson',
        '/data/roads.geojson',
        '/data/points.geojson',
        'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css',
        'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js'
      ]))
    );
  });
  
  self.addEventListener('fetch', e => {
    e.respondWith(
      caches.match(e.request).then(response => response || fetch(e.request))
    );
  });
  