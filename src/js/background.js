let isNotificationGranted = false

function requestPermission() {
    console.log("requesting permission for notification");
    Notification.requestPermission()
        .then(result => {
            if (result === "denied") return console.log("notification denied");
            else if (result === "default") return console.log("notification exited");
            isNotificationGranted = true;
            return console.log("notification granted");
        })
}

let notifyTimeout = 0

export function notifyMatch(data) {
    if (notifyTimeout === 0 && isNotificationGranted) {
        const countDown = new Date(data.utcDate) - Date.now();
        notifyTimeout = setTimeout(() => {
            showMatchNotification(data.awayTeam.name, data.homeTeam.name)
        }, countDown);
    }
}

function showMatchNotification(away, home) {
    const title = `KICK OFF!`
    const options = {
        body: `${home} VS ${away} Has been Started`,
        icon: "./src/icons/ball2.ico",
        badge: "./src/icons/ball2.ico",
        tag: "match-notification",
        renotify: true,
        vibrate: [300, 300]
    }

    if (Notification.permission === "granted") {

        navigator.serviceWorker.ready.
        then(reg => {
                reg.showNotification(title, options)
            })
            .catch(e => console.error(e))
    }
}

export function urlBase64ToUint8Array(base64String) {
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

if ("Notification" in window) {
    requestPermission()
} else {
    console.error("Notification is not supported");
}