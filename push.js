const webPush = require('web-push');
const VAPID_KEY = {
    "publicKey": "BOaUpWREgpthUkhyM5wZuyDGmPkdqfUufOZjvOKsx2pdncEZK-gV1J9kv8XPqFGh9rhDbwHEk4dfBLBQz4yeyZk",
    "privateKey": "JpErU5Kdan9MnzwvhfjNm7IOPYDoKZGkK4IFjWLihhw"
};

const PUSH_PROPERTIES = {
    endpoint: "https://fcm.googleapis.com/fcm/send/ccPtIcNAAxk:APA91bEFA4rFkSzlCRx7eWErV5CLANZsu_er2Yx3a4gSduAfg-4iHr4DQLHqtjHVQLORBEPZNrwhSLSUErhIHXzJa69ubFK5i7VCviJhX61zLtaU7LCarEvmLeVSm17SQ8RYcl4Dun7i",
    keys: {
        p256dh: "BNdFodaYG9Fz58fXfIx6blQUU9Frv/ill+S/Cffm/sx8jMXO8M37OwMJVPp0Nu3aJZJtgZ+4rruGlif86Il0A5g=",
        auth: "YvX1dTvFG5SLcKKNY8abaw=="
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

webPush.sendNotification(PUSH_PROPERTIES, payload, PUSH_OPTIONS)
    .catch(err => console.log(err))