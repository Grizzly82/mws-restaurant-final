// Use a cacheName for cache versioning
var staticCacheName = 'v1:static';

// During the installation phase, you'll usually want to cache static assets.
self.addEventListener('install', event => {
  const toCache = [
                './',
                '/index.html',
                './css/styles.css',
                '/restaurant.html',
                '/js/main.js',
                '/js/app.js',
                '/js/serviceWorkerController.js',
                '/js/restaurant_info.js',
                '/js/dbhelper.js',
                '/js/idb.js',
                '/css/styles.css',
                '/data/restaurants.json',
                '/img/1.jpg',
                '/img/2.jpg',
                '/img/3.jpg',
                '/img/4.jpg',
                '/img/5.jpg',
                '/img/6.jpg',
                '/img/7.jpg',
                '/img/8.jpg',
                '/img/9.jpg',
                '/img/10.jpg',
                '/img/1-315_small.jpg',
                '/img/2-315_small.jpg',
                '/img/3-315_small.jpg',
                '/img/4-315_small.jpg',
                '/img/5-315_small.jpg',
                '/img/6-315_small.jpg',
                '/img/7-315_small.jpg',
                '/img/8-315_small.jpg',
                '/img/9-315_small.jpg',
                '/img/10-315_small.jpg',
                '/img/1-600_medium.jpg',
                '/img/2-600_medium.jpg',
                '/img/3-600_medium.jpg',
                '/img/4-600_medium.jpg',
                '/img/5-600_medium.jpg',
                '/img/6-600_medium.jpg',
                '/img/7-600_medium.jpg',
                '/img/8-600_medium.jpg',
                '/img/9-600_medium.jpg',
                '/img/10-600_medium.jpg',
                '/img/1-800_large_1X.jpg',
                '/img/2-800_large_1X.jpg',
                '/img/3-800_large_1X.jpg',
                '/img/4-800_large_1X.jpg',
                '/img/5-800_large_1X.jpg',
                '/img/6-800_large_1X.jpg',
                '/img/7-800_large_1X.jpg',
                '/img/8-800_large_1X.jpg',
                '/img/9-800_large_1X.jpg',
                '/img/10-800_large_1X.jpg',
                '/img/favicon.ico' ,
                '/restaurant.html?id=1',
                '/restaurant.html?id=2',
                '/restaurant.html?id=3',
                '/restaurant.html?id=4',
                '/restaurant.html?id=5',
                '/restaurant.html?id=6',
                '/restaurant.html?id=7',
                '/restaurant.html?id=8',
                '/restaurant.html?id=9',
                '/restaurant.html?id=10'
       
              ];

              event.waitUntil(caches.open(staticCacheName).then(cache => {
                toCache.forEach(link => cache.add(link));
              }))
            });


self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(cacheNames) {
    return Promise.all(cacheNames.filter(function(cacheName) {
      return cacheName.startsWith('restaurant-') && cacheName != staticCacheName;
    }).map(function(cacheName) {
      return caches.delete(cacheName);
    }));
  }));
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    event.respondWith(caches.match(event.request).then(function(response) {
      // Fetch and cache the response if response has not been cached.
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open(staticCacheName).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        })
      });
    }));
  }
});