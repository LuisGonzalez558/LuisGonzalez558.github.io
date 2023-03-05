//Asignar nombre y version de la cache
const CACHE_NAME='v1_cache_BCH_PWA';

//configuracion de los ficheros
var urlsToCache=[
    './index.html',
    './sw.js',
    './main.js',
    './manifest.js',
    './windows11/StoreLogo.scale-125.png',
    './windows11/StoreLogo.scale-150.png',
    './windows11/StoreLogo.scale-200.png',
    './windows11/Square44x44Logo.targetsize-256.png'
];

self.addEventListener('install', e=>{

    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache)
                        .then(() =>{
                            self.skipWaiting(); 
                        })
        })
        .catch(err=>console.log('No se ha registrado el cache', err))
);
});

self.addEventListener('activate',e => {
    const cacheWhitelist = [CACHE_NAME];


    e.waitUntil(
        caches.keys()
                .then(cacheNames=>{
                return Promise.all(
                    cacheNames.map(cacheName =>{
                        if(cacheWhitelist.indexOf(cacheName)== -1)
                        {

                            return cache.delete(cacheName);
                        }
                    })
                );
               })
               .then(()=> {
                self.clients.claim(); 
               })
    );

});

self.addEventListener('fetch',e => {
    e.respondWith(
        caches.match(e.request)
                .then (res => {
                    if(res){
                        return res;
                    }
                    return fetch(e.request); 
                })
    );
});