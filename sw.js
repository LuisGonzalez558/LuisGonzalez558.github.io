//Asignar nombre y version de la cache
const CACHE_NAME='v1_cache_BCH_PWA';

//configuracion de los ficheros
var urlsToCache=[
    './',
    './windows11/StoreLogo.scale-125.png',
    './windows11/StoreLogo.scale-150.png',
    './windows11/StoreLogo.scale-200.png'
];

self.addEventListener('install', e=>{
    e.waitUntill(
        caches.open(CACHE_NAME)
              .then(cache => {
                return cache.addAll(urlsToCache)
                .then(()=> self.skipWaiting()
                )
        })
        .catch(err=>console.log('No se ha registrado el cache', err))
    )
});

self.addEventListener('activate',e => {
    const cacheWhitelist = [CACHE_NAME];
    //que el evento espere a que termine de ejecutar
    e.waitUntill(
        caches.keys()
        .then(cacheNames=>{
            return Promise.all(
                cacheNames.map(cacheName => {
                    if(cacheWhitelist.indexOf(cacheName)== -1)
                    {
                        return caches.delete(cacheName);
                    }
                })
            )
        })
        .then(()=>{
            self.clients.claim();//activa la cache en el dispositivo
        })
    )
});

self.addEventListener('fetch',e => {
    e.respondWith(
        caches.match(e.request)
        .then(res => {
            if(res){
                //devuelvo datos desde cache
                return res;
            }
            return fetch(e.request);//hago peticion al servidor en caso de que no este en cache
        })
    )
});