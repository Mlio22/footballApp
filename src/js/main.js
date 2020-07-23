import "../css/customs.css";

import { abortCompetitions } from "./components/competitions.js"
import { abortHome } from "./components/home.js"
import { abortSaved } from "./components/saved.js"

import { getNavBar } from "./components/nav.js"
import { switchUrl } from "./utils.js"
import { urlBase64ToUint8Array } from "./background.js"

// abort fetch requests
function abortAll(page) {
    const abortOptions = {
        home: abortHome,
        competitions: abortCompetitions,
        saved: abortSaved
    }

    for (const prop in abortOptions) {
        if (page.includes(prop)) continue;
        abortOptions[prop]();
    }
}

function pushInit(registration) {
    if ("PushManager" in window) {
        registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array("BOaUpWREgpthUkhyM5wZuyDGmPkdqfUufOZjvOKsx2pdncEZK-gV1J9kv8XPqFGh9rhDbwHEk4dfBLBQz4yeyZk")
            })
            .then(sub => {
                console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                    null, new Uint8Array(sub.getKey('p256dh')))));
                console.log('Berhasil melakukan subscribe dengan auth key:', btoa(String.fromCharCode.apply(
                    null, new Uint8Array(sub.getKey('auth')))));

                console.log(`berhasil terhubung dengan endpoint ${sub.endpoint}`);

            })
            .catch(e => {
                console.error('Tidak dapat melakukan subscribe ', e.message);
            })
    }
}

function webWorkerInit() {
    if (!("serviceWorker" in navigator)) {
        console.error("service worker not available");
    } else {
        // note: switch to "/" in dev mode
        // note: switch to "/build/" in prod mode
        navigator.serviceWorker.register("./sw.js", { scope: '/' })
            .then((reg) => {
                console.log(`sw terdaftar di ${reg.scope} dengan info ${reg}`);
                let swStatus;
                if (reg.installing) swStatus = reg.installing
                if (reg.waiting) swStatus = reg.waiting
                if (reg.active) swStatus = reg.active

                if (swStatus) {
                    swStatus.addEventListener("statechange", (e) => {
                        if (e.target.state === "activated") {
                            pushInit(reg);
                        }
                    })
                }
            })
            .catch(e => console.error(e))

    }
}

document.addEventListener("DOMContentLoaded", function() {
    // fetching navbar(s).
    webWorkerInit();
    getNavBar()
        .then(() => {
            // get web url
            switchUrl();
        });
})


window.onpopstate = (e) => {
    try {
        $(".tooltipped").tooltip("close");
    } catch (e) {}
    let nav = switchUrl(e);
    abortAll(nav)
}