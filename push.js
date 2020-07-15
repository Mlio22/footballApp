const webPush = require('web-push');
const VAPID_KEY = {
    "publicKey": "BJ-RNCcYVJZ3ltj8ygFVDX10s6_EcAFbQ7LS2Hi_202gPBv3O7zcZxycb8esTqh-izIZcQE49Lqmfk61ezB1cl8",
    "privateKey": "iBpPrAWSAUqhQXBRCd2Y157S_FGLS6g0ztQPNcZtdzc"
};

const PUSH_PROPERTIES = {
    endpoint: " https://fcm.googleapis.com/fcm/send/dBe2JGjuLaA:APA91bElCx9DFDvjliG5FNoWKYdyL5icwHOLu-974STyFFcnAbfBa0BCrLT0cNVF9DxoR6AmYHaLw0PIRqaOizePvVbACPJ4aUK552JsfWR5MYJJ0eD5n3S8PePtEYQRkTNRFy5wf3Or",
    keys: {
        p256dh: "BIibcvMf71TekYY5xPwQU+R99sUwZy35emin5CQ7hzTmgRd4mCeZH+j1wSRc36iG+nIXUcUDJQYtD7H7jR2uru8=",
        auth: "w6pA2AIZQ8hsVIuS+r2OpQ=="
    }
}

const PUSH_OPTIONS = {
    gcmAPIKey: "684599638781",
    TTL: 60
};

webPush.setVapidDetails(
    "mailto:muhammatliopratama@gmail.com",
    VAPID_KEY.publicKey,
    VAPID_KEY.privateKey
)

let payload = "This is Spartan!!";

webPush.sendNotification(PUSH_PROPERTIES, payload, PUSH_OPTIONS);