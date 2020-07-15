import _ from "lodash"
import "../css/customs.css";

import { abortCompetitions } from "./components/competitions.js"
import { abortHome } from "./components/home.js"
import { abortSaved } from "./components/saved.js"

import { getNavBar } from "./components/nav.js"
import { switchUrl } from "./utils.js"
import { urlBase64ToUint8Array } from "./background.js"

// abort fetch requests
function abortAll(page) {
    console.log("yang tidak ingin di abort :", page);
    const abortOptions = {
        home: abortHome,
        competitions: abortCompetitions,
        saved: abortSaved
    }

    for (const prop in abortOptions) {
        if (page.includes(prop)) continue;
        console.log(prop);
        abortOptions[prop]();
    }
}

function webWorkerInit() {
    if (!("serviceWorker" in navigator)) {
        console.log("service worker not available");
    } else {
        navigator.serviceWorker.register("./sw.js")
            .then((reg) => {
                if ("PushManager" in window) {
                    navigator.serviceWorker.getRegistration()
                        .then(reg => {
                            reg.pushManager.subscribe({
                                    userVisibleOnly: true,
                                    applicationServerKey: urlBase64ToUint8Array("BFqdbYuO3YwJWDEIOm6a-TETlTeORFRgZZxxXtzKEGK2zk0o-Ia9y6ImzX-nMDe_o2mEXBP8j83YYNWog5hs-Is")
                                })
                                .then(sub => {
                                    console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                                        null, new Uint8Array(sub.getKey('p256dh')))));
                                    console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                                        null, new Uint8Array(sub.getKey('auth')))));

                                    console.log(`berhasil terhubung dengan endpoint ${sub.endpoint}`);

                                })
                                .catch(e => {
                                    console.error('Tidak dapat melakukan subscribe ', e.message);
                                })
                        })
                }
                console.log(`registration ${reg} finished`);
            })
            .catch(e => console.log(e))

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
    } catch (e) {
        console.log(e);
    }
    let nav = switchUrl(e);
    abortAll(nav)

}