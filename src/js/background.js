let isNotificationGranted = false

function requestPermission() {
    Notification.requestPermission()
        .then(result => {
            console.log(result);
            if (result === "denied") return console.log("notification denied");
            else if (result === "default") return console.log("notification exited");
            isNotificationGranted = true;
            return console.log("notification granted");
        })
}

let notifyTimeout = 0

function notifyMatch(data) {
    if (notifyTimeout === 0 && isNotificationGranted) {
        const countDown = new Date(data.utcDate) - Date.now();
        console.log(`countdown akan mulai dalam ${countDown/(1000*60*60)} jam lagi`);
        notifyTimeout = setTimeout(() => {
            showMatchNotification(data.awayTeam.name, data.homeTeam.name)
        }, countDown);
    }
}

function showMatchNotification(away, home) {
    const title = `KICK OFF!`
    const options = {
        body: `${home} VS ${away} Has been Started`,
        icon: "/src/icons/ball.ico",
        badge: "/src/icons/ball.ico",
        tag: "match-notification",
        renotify: true,
        vibrate: [300, 300]
    }

    if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.
        then(reg => reg.showNotification(title, options))
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

if (!("serviceWorker" in navigator)) {
    console.log("service worker not available");
} else {
    navigator.serviceWorker.register("./sw.js")
        .then((reg) => {
            console.log(`registration ${reg} finished`);
        })
}

if ("Notification" in window) {
    requestPermission()
} else {
    console.log("Notification is not supported");
}

if ("PushManager" in window) {
    navigator.serviceWorker.getRegistration()
        .then(reg => {
            reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array("BJ-RNCcYVJZ3ltj8ygFVDX10s6_EcAFbQ7LS2Hi_202gPBv3O7zcZxycb8esTqh-izIZcQE49Lqmfk61ezB1cl8")
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