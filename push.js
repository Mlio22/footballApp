const webPush = require('web-push');
const VAPID_KEY = {
    "publicKey": "BJ-RNCcYVJZ3ltj8ygFVDX10s6_EcAFbQ7LS2Hi_202gPBv3O7zcZxycb8esTqh-izIZcQE49Lqmfk61ezB1cl8",
    "privateKey": "ZroqCqUwkPrLh0lYepFzB1YKZ3ir8Tngmv16P5lyfGA"
};

const PUSH_PROPERTIES = {
    endpoint: "https://fcm.googleapis.com/fcm/send/fsoxb2KPSBU:APA91bGmdys0AxdWjzDx5R5SwiEebcLUZ6_8TBA--w0gwuRkBg0Qh5U3d4m4oYQFwpOcO1KpuYUBEBebNJWZ0zkRgQGE0y7r7AlGY5gv3X4PGkLV7hQgL7SBaTM940Bul9QZje9Bps4t",
    keys: {
        p256dh: "BMFrWKQgFrdv9ZDWaFymz2sJ9E3h8H19EST0NMZCuO+FuLE4Cf1RhHu1cEerKdE7ElGLvl3ANtHgPejYGwHG1Zs=",
        auth: "+WN+pzO14kEa4d85ta4hlg=="
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