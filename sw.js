// sw.js - Service Worker do PiZZA Master
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalado.');
});

self.addEventListener('fetch', (event) => {
    // Permite que o app funcione normalmente carregando da internet
    event.respondWith(fetch(event.request));
});
