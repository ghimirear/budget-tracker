const cacheName = 'v1';
const runtime = 'runtime';
const cacheAssets = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/styles.css",
  "/indexDB.js",
  "/index.js",
  "/service-worker.js",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
]
// Installation
self.addEventListener('install', (e)=>{
    console.log("service worker is installed");
    e.waitUntil(
        caches.open(cacheName)
        .then(cache=>{
           console.log('Service worker : Caching files');
           // adding files to caches for offline use
           cache.addAll(cacheAssets)
        })
        .then(()=>self.skipWaiting())
    )
})
// activation 
self.addEventListener('activate', (e)=>{
    console.log("service worker is activated");
    e.waitUntil(
        caches.keys()
        .then((cache)=>{
            return cache.filter((cache)=> !cacheName.includes(cache));
        })
        .then((cachesToDelete)=>{
            // deleting older caches
            return Promise.all(
                cachesToDelete.map((cacheToDelete)=>{
                    return caches.delete(cacheToDelete);
                })
               
            );
        })
        .then(()=> self.clients.claim())
    )
})
// caching all the files.
self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return caches.open(runtime).then((cache) => {
            return fetch(event.request).then((response) => {
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }

});