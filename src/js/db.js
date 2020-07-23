import idb from "idb"

const STORE_NAMES = ["match", "competition"]


const dbPromise = idb.open("footballDb", 2, function(upDb) {
    console.log("creating IndexedDb Stores");
    if (!upDb.objectStoreNames.contains("match")) {
        upDb.createObjectStore(STORE_NAMES[0], { keyPath: "id" });
    }

    if (!upDb.objectStoreNames.contains("competition")) {
        upDb.createObjectStore(STORE_NAMES[1], { keyPath: "id" });
    }
})


export function saveItem(type, item) {
    return new Promise(resolve => {
        dbPromise.then(db => {
            if (!(type === "match" || type === "competition")) {
                return;
            }

            item["saved_time"] = new Date()
            item["type"] = type
            const tx = db.transaction(type, "readwrite");
            const store = tx.objectStore(type);

            store.put(item);
            resolve(tx.complete);
        })
    })
}

export function deleteItem(type, id) {
    return new Promise(resolve => {
        dbPromise.then(db => {
            if (!(type === "match" || type === "competition")) {
                return;
            }

            const tx = db.transaction(type, "readwrite");
            const store = tx.objectStore(type);

            store.delete(id);

            resolve(tx.complete)
        })
    })
}

export function getSaved(type, id) {
    return new Promise((resolve) => {
        dbPromise.then(db => {
            if (!(type === "match" || type === "competition")) {
                return;
            }

            const tx = db.transaction(type, "readwrite");
            const store = tx.objectStore(type);
            resolve(store.get(id));
        })
    })
}

export function getAllSaved() {
    return new Promise((resolve) => {
        dbPromise.then(db => {
            let datas = []
            STORE_NAMES.forEach(name => {
                const tx = db.transaction(name, "readonly");
                const store = tx.objectStore(name);

                datas.push(store.getAll());
            })

            Promise.all(datas)
                .then(response => {
                    resolve(response[0].concat(response[1]));
                })
        })
    })


}

export function checkSaved(type, id) {
    return new Promise((resolve) => {
        dbPromise.then(db => {
            if (!(type === "match" || type === "competition")) {
                return;
            }

            const tx = db.transaction(type, "readwrite");
            const store = tx.objectStore(type);
            resolve(store.get(parseInt(id)))
        })
    })
}