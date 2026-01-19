// Este arquivo permite que o Chrome instale o site como um App
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Necessário para o critério de instalação do PWA
});
