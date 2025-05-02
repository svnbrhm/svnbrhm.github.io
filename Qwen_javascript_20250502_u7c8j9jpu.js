const CACHE_NAME = 'japan-itinerary-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/js/main.js',
  '/manifest.json'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});