// workbox init(s)
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
const router = workbox.routing,
    precache = workbox.precaching,
    expire = workbox.expiration,
    strategy = workbox.strategies,
    core = workbox.core,
    cacheable = workbox.cacheableResponse;

core.skipWaiting();
core.clientsClaim();

if (workbox) {
    console.log("hooray workbox is here");
}

// precache all
precache.precacheAndRoute(self.__WB_MANIFEST);

// network first to all API data(s)
router.registerRoute(
    ({ url }) => {
        return url.origin === "https://api.football-data.org";
    },
    new strategy.NetworkFirst({
        cacheName: "API datas",
        plugins: [
            new expire.ExpirationPlugin({
                // expire 1 day
                maxAgeSeconds: 24 * 60 * 60
            })
        ],
    })
)

// cache first to all image assets
router.registerRoute(
    ({ url }) => {
        let a = new RegExp("\.(?:jpg|svg|png|jpeg)");
        return (url.pathname.match(a));
    },
    new strategy.StaleWhileRevalidate({
        cacheName: "Image Assets",
        plugins: [
            new expire.ExpirationPlugin({
                // expire 30 days
                maxAgeSeconds: 30 * 24 * 60 * 60
            }),
            new cacheable.CacheableResponse({
                statuses: [0, 200]
            })
        ]

    })
)

self.addEventListener("push", function(e) {
    let body = e.data.text() || "This is just an empty message"
    let options = {
        body: body,
        icon: "/src/icons/ball.ico",
        vibrate: [300, 300],
    }

    e.waitUntil(
        self.registration.showNotification("Push Message", options)
    )
})