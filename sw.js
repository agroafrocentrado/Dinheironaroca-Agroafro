const CACHE = 'dinheiro-roca-v1';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', (evento) => {
  self.skipWaiting();
  evento.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ARQUIVOS)).catch(() => {})
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(chaves.filter((c) => c !== CACHE).map((c) => caches.delete(c)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((resposta) => {
      return resposta || fetch(evento.request).then((rede) => {
        const copia = rede.clone();
        caches.open(CACHE).then((cache) => cache.put(evento.request, copia));
        return rede;
      }).catch(() => resposta);
    })
  );
});
