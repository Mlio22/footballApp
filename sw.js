const CACHE_NAME = ["permanent-cache-v1", "temporary-data-cache-v1"];
var PERMANENT_FILES = [
    // html(s)
    "/index.html",
    "/components/nav.html",
    "/components/home.html",
    "/components/competitionsAndSaved.html",
    "/components/competition-item.html",
    "/components/saved.html",

    // css(s)
    // js(s)
    "/build/bundle.js",

    // cdn(s)
    "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js",

]

self.addEventListener("install", function(e) {
    // instalation
    e.waitUntil(
        caches.open(CACHE_NAME[0])
        .then(cache => {
            let result = cache.addAll(PERMANENT_FILES);
            // self.location.replace("");
            return result
        })
    )
})

self.addEventListener("activate", function(e) {
    console.log("aowokawokaowkaowk1");

    // activation
})

self.addEventListener("fetch", function(e) {
    e.respondWith(
        caches.match(e.request)
        .then(responseCache => {
            if (responseCache) {
                // only refresh temporary data if it's online and use the cache if offline
                // on main.fetchAndCache()
                console.log(e.request.url.includes("https://api.football-data.org/v2/matches"));
                if (e.request.url.includes("https://api.football-data.org/v2/")) {
                    console.log("ada kok");
                    let requestClone = e.request.clone();

                    return fetch(requestClone)
                        .then(newResponseCache => {
                            if (!newResponseCache || newResponseCache.status !== 200) {
                                return responseCache
                            }
                            return newResponseCache
                        })
                        .catch((err) => {
                            console.log(`using latest data of ${e.request.url} because of ${err}`);
                            return responseCache
                        })
                }
                return responseCache
            }

            // adding ordinary dinamic caching for other neccessary (but not critical) files (eg: flag svgs)
            // edit : caching svg files requires big cache memory
            return fetch(e.request)
                .then(response => {
                    if (response.status === 200 || response) {
                        console.log("masuk sini");

                        let responseClone = response.clone();
                        console.log("adding new file to cache");

                        caches.open(CACHE_NAME[0])
                            .then(cache => cache.put(e.request, responseClone))
                    }
                    return response
                })

            return fetch(e.request)

        })
    )
})

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