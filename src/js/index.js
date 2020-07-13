// because of importing issues
// need to make one file to make webpack work

let timer, a, b

const API_HEADER = {
    "X-Auth-Token": "9acaf4710891457ea9104fa7c96cbd1c"
}

const ICONS = {
    home: "tv",
    competitions: "leaderboard",
    saved: "save"
}

const TEXTS = {
    home: "Latest Matches",
    competitions: "Competitions",
    saved: "Saved Pages"
}

function getNewOptions(signal) {
    return {
        headers: API_HEADER,
        signal: signal
    }
}

function toText(response) {
    return new Promise(resolve => {
        resolve(response.text())
    })
}

function toJson(response) {
    return new Promise(resolve => {
        resolve(response.json())
    })
}

function getTimeMatch(time) {
    time = new Date(time);
    time = time.toString()
    time = time.split(" ")[4].slice(0, 5);
    return time
}

function clearAllTimeouts() {
    try {
        if (timer) clearTimeout(timer)
        if (b) clearTimeout(b)
    } catch (e) {}
}

// abort fetch requests
function abortAll() {
    controllerHome.abort();
    controllerCompetitions.abort();
}

function redirectHome(param) {
    window.location.href = param === param.toLowerCase() ? "#home" : `#${param.toLowerCase()}`;
}

function switchUrl(e = "") {
    const url = window.location.href;
    let param = (url.split("//")[1].split("/")[1].split("#")[1]) || "";

    addLoader(document.querySelector(".page-content"));
    abortAll();

    if (param === "" || param === "home") {
        getHome();
    } else if (param.startsWith("competitions")) {
        let id = param.split("?")[1] || "";
        getCompetitions(id);
    } else if (param.startsWith("saved")) {
        let type, id;
        let params = param.split("?")[1]

        if (params) {
            params = params.split("&");
            [type, id] = [params[0], params[1]];
            console.log(type, id);
        }
        getSavedPage(type, id);
    } else {
        redirectHome(param);
    }

    param = param.split("?")[0] || param;
    switchNav(param || "home");

}

function addLoader(element) {
    element.innerHTML = `<div class="ball-loader-wrapper">
    <div class="ball-loader">
        <div></div>
    </div>
</div>`;
}

function removeLoader(element) {
    try {
        let wrapper = element.querySelector(".ball-loader-wrapper");
        if (wrapper) wrapper.remove();
    } catch (err) {}
}


// fetch and cache old 
function fetchAndCache(url, fetchOptions, returnType) {
    const request = new Request(url);

    return new Promise((resolve) => {
        fetch(url, fetchOptions)
            .then(response => {
                if (response.status === 200) {
                    console.log(`adding / updating data of ${url}`);

                    // cache the temporary data for first SPA load
                    // while serviceWorker is not on the fetch state

                    let responseClone = response.clone();
                    caches.open("temporary-data-cache-v1")
                        .then(cache => cache.put(request, responseClone));
                }

                if (returnType === "json") {
                    resolve(response.json())
                } else if (returnType === "text") {
                    resolve(response.text())
                }
            })
            .catch(err => {
                document.querySelector(".page-content").innerHTML = `error happened : ${err}`;
            })
    })
}

// saves file 
function saveDataInit(type, id, index = null) {

    const tooltipBtn = document.querySelector(".save-btn .tooltipped");

    let msg = ""
    checkSaved(type, id)
        .then(response => {
            msg = response ? "Already Saved" : "save"
            tooltipBtn.setAttribute("data-tooltip", msg);
            tooltipBtn.setAttribute("data-type", type);
            tooltipBtn.setAttribute("data-index", index);

            $('.tooltipped').tooltip("close");
        })
}

function saveDataInteraction(data) {
    document.querySelector(".save-btn .tooltipped").addEventListener("click", function() {
        console.log(data);
        let data_tooltip = this.attributes[2].value,
            data_index = parseInt(this.attributes[4].value),
            data_type = this.attributes[3].value;

        if (!(data_tooltip === "Already Saved" || data_tooltip === "Saved")) {

            var saveData = data_index + 1 ? data[data_index] : data;
            saveItem(data_type, saveData)
                .then(() => {
                    this.setAttribute("data-tooltip", "Saved");
                    $(".tooltipped").tooltip("close");
                    setTimeout(() => {
                        $('.tooltipped').tooltip("open");
                        setTimeout(() => {
                            $(".tooltipped").tooltip("close");
                        }, 1000)
                    }, 350)

                });
        }
    })
}
document.addEventListener("DOMContentLoaded", function() {
    // fetching navbar(s).



    getNavBar()
        .then(() => {
            // get web url
            switchUrl();
        });
})


window.onpopstate = (e) => {
    abortAll();
    clearAllTimeouts();
    switchUrl(e);
}

const STORE_NAMES = ["match", "competition"]

const dbPromise = idb.open("footballDb", 1, function(upDb) {
    if (!upDb.objectStoreNames.contains("match")) {
        upDb.createObjectStore(STORE_NAMES[0], { keyPath: "id" });
    }

    if (!upDb.objectStoreNames.contains("competition")) {
        upDb.createObjectStore(STORE_NAMES[1], { keyPath: "id" });
    }
})

function saveItem(type, item) {
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

function delete_item(type, id) {
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

function getSaved(type, id) {
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

function getAllSaved() {
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

function checkSaved(type, id) {
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

var controllerSaved = new AbortController();
var { signal: signalSaved } = controllerSaved

// get the saved dashboard
function getSavedPage(type = null, id = null) {
    if (type === "match" || type === "competition") {
        type === "match" ? getSavedMatch(id) : getSavedCompetition(id);
    } else {
        // fetch the page
        fetch("./components/competitionsAndSaved.html", getNewOptions(signalSaved))
            .then(toText)
            .then(responseText => {
                document.querySelector(".page-content").innerHTML = responseText

                // fetch saved content
                getAllSaved()
                    .then(datas => {
                        removeLoader(document.querySelector(".competitionsAndSaved .container .row.page-data"))

                        // sorting by time saved
                        datas = datas.sort((a, b) => new Date(a.saved_time) - new Date(b.saved_time))

                        // set array for filter and re-render data
                        let filterableSavedData = [],
                            renderDatas = []

                        datas.forEach(data => {
                            let renderContent = [],
                                renderName, renderArea;
                            if (data.type === "match") {
                                renderName = `${data.team[0]} VS ${data.team[1]}`
                                renderArea = data.competition;

                                renderContent = [data.id, data.flag[1], `${renderName} - ${renderArea}`, data.type];
                                renderSaved(renderContent);
                            } else {
                                renderName = data.name
                                renderArea = data.area.name;

                                renderContent = [data.id, FLAGS[data.area.name.toLowerCase()], `${renderName} - ${renderArea}`, data.type];
                                renderSaved(renderContent);
                            }

                            renderDatas.push(renderContent);

                            // this is kinda strange
                            // on match, renderArea is the competition
                            // but on competition, renderArea is the area of it

                            filterableSavedData.push({
                                area: renderArea,
                                name: renderName
                            })
                        })

                        searchSaved(filterableSavedData, renderDatas)
                    })
            })
    }
}

function renderSaved(content) {
    const [id, flagUrl, title, type] = content
    const cardWrapElement = document.createElement("div");
    cardWrapElement.className = "col l3 m6 s12";

    cardWrapElement.innerHTML = `<div class="card">
                    <div class="card-image">
                        <img src="${flagUrl}">

                    </div>
                    <div class="card-content">
                        <p>${title}</p>
                    </div>
                    <div class="card-action right-align">
                        <a href="#saved?${type}&${id}">See Details</a>
                    </div>
                </div>`;

    document.querySelector(".competitionsAndSaved .container .row.page-data").appendChild(cardWrapElement);
}

// get saved match by id
function getSavedMatch(id) {
    fetch("./components/home.html", getNewOptions(signalSaved))
        .then(toText)
        .then(responseText => {
            document.querySelector(".page-content").innerHTML = responseText

            // a litte exception
            deleteInit("match", id);
            document.querySelector(".fixed-action-btn i").innerHTML = "delete";

            getSaved("match", parseInt(id))
                .then(response => {
                    if (!response) {
                        document.querySelector(".page-content").innerHTML = "Saved content not found, Maybe you deleted it?";
                        return;
                    }

                    let { competition, date, flag, referees, score, status, team } = response;

                    date = getTimeMatch(date);

                    document.querySelectorAll(".home> div").forEach(el => {
                        console.log(el);
                        el.querySelector(".time").innerHTML = `${status.toLowerCase()} - ${date} WIB`;
                        el.querySelector(".savedFlag").setAttribute("style", `background-image: url('${flag[1]}')`)
                        el.querySelector(".homeTeam .score").innerHTML = score[0] === null ? " - " : score[0];
                        el.querySelector(".homeTeam .teamName").innerHTML = team[0];
                        el.querySelector(".awayTeam .score").innerHTML = score[1] === null ? " - " : score[1];
                        el.querySelector(".awayTeam .teamName").innerHTML = team[1];
                        el.querySelector(".competitionName").innerHTML = competition
                    })

                    document.querySelector(".matchDetails .competitionName").innerHTML = competition;

                    const ulElement = document.createElement("ul");
                    referees.forEach(referee => ulElement.innerHTML += `<li>${referee.name}</li>`)

                    document.querySelector(".matchDetails .refereesName").appendChild(ulElement)
                    $('.tooltipped').tooltip();
                })


            deleteInteraction();
        })
}

// get saved competition by id
function getSavedCompetition(id) {
    fetch("./components/competition-item.html", getNewOptions(signalSaved))
        .then(toText)
        .then(responseText => {
            document.querySelector(".page-content").innerHTML = responseText

            // a litte exception
            document.querySelector(".fixed-action-btn i").innerHTML = "delete"

            deleteInit("competition", id);

            getSaved("competition", parseInt(id))
                .then(response => {
                    if (!response) {
                        document.querySelector(".page-content").innerHTML = "Saved content not found, Maybe you deleted it?";
                        return;
                    }
                    // since it doing in the same way and result
                    renderCompetitionItem(response)
                })
            $('.collapsible').collapsible();
            $('.tooltipped').tooltip();

            deleteInteraction();

        })
}

function searchSaved(filters, renderContents) {
    document.querySelectorAll(".competitionsAndSaved input.validate").forEach(el => {
        el.addEventListener("keyup", function(e) {
            const inputFilter = e.target.value.toLowerCase()

            let availableFilter = false;
            document.querySelector(".competitionsAndSaved .container .row.page-data").innerHTML = "";

            filters.forEach((filter, idx) => {
                if (filter.area.toLowerCase().includes(inputFilter) || filter.name.toLowerCase().includes(inputFilter)) {
                    availableFilter = true;
                    renderSaved(renderContents[idx])
                }
            })

            if (!availableFilter) {
                document.querySelector(".competitionsAndSaved .container .row.page-data").innerHTML = "No data available";
            }
        })
    })
}

function deleteInit(type, id) {
    const tooltipBtn = document.querySelector(".tooltipped");
    let msg = "";

    checkSaved(type, id)
        .then(response => {
            msg = response !== undefined ? "Delete" : "Deleted";

            tooltipBtn.setAttribute("data-tooltip", msg);
            tooltipBtn.setAttribute("data-type", type);
            tooltipBtn.setAttribute("data-id", id);
        })
}

function deleteInteraction() {
    console.log("yaharo");
    document.querySelector(".tooltipped").addEventListener("click", function() {
        let data_tooltip = this.attributes[2].value,
            data_id = parseInt(this.attributes[4].value),
            data_type = this.attributes[3].value;

        if (data_tooltip !== "Deleted") {
            delete_item(data_type, data_id)
                .then(() => {
                    this.setAttribute("data-tooltip", "Deleted");
                    $(".tooltipped").tooltip("close");
                    setTimeout(() => {
                        $('.tooltipped').tooltip("open");
                        setTimeout(() => {
                            $(".tooltipped").tooltip("close");
                        }, 3000)
                    }, 350)
                })
        }
    })
}

function getNavBar() {
    return new Promise((resolve) => {
        fetch("./components/nav.html")
            .then(toText)
            .then(responseText => {
                document.querySelector(".navigation").innerHTML = responseText

                // materialize things

                $('.dropdown-trigger').dropdown();
                $('.tabs').tabs();

                let sidebar = document.querySelector(".sidenav");
                M.Sidenav.init(sidebar);
                switchNavOnClick();
                resolve("");

                window.addEventListener("resize", function() {
                    $(".sidenav").sidenav("close");
                })

                // bug fix on pwa

                document.querySelectorAll(".pwa-nav").forEach(el => {
                    el.addEventListener('click', function() {
                        window.location.href = this.hash
                    })
                })

            })
            .catch(err => {
                console.error(err);
                resolve("");
            })
    })
}

function switchNavOnClick() {
    document.querySelectorAll(".selectNav li").forEach(el => {
        el.addEventListener("click", function() {
            if (!this.className.includes("active")) {
                const key = this.dataset.link;
                switchNav(key);

                $(".sidenav").sidenav("close");
            }
        })
    })
}

function switchNav(nav) {
    document.querySelectorAll(".selectNav li.active").forEach(e => {
        e.classList.remove("active");
    })

    document.querySelectorAll(`.selectNav li[data-link=${nav}]`).forEach(e => {
        e.classList.add("active");
    })

    document.querySelectorAll(".changeAble-icon").forEach(e => {
        e.innerHTML = ICONS[nav];
    })

    document.querySelectorAll(".changeAble-text").forEach(e => {
        e.innerHTML = TEXTS[nav]
    })
}

// controller for abort fetch request
var controllerHome = new AbortController();
var { signal: signalHome } = controllerHome

// format date to yyyy-mm-dd
// https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd

function formatDate(d) {
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    console.log([year, month, day].join('-'));
    return [year, month, day].join('-');
}

// remove old indicators when screen rezises
function removeIndicators() {
    document.querySelectorAll(".carousel ul.indicators").forEach(el => {
        el.remove();
    })
}

// re-render the information div
function reRenderInfo(infoData) {
    console.log(infoData);
    let time = getTimeMatch(infoData.date);

    // creating li for referees
    const ulElement = document.createElement("ul");
    if (infoData.referees.length > 0) {
        infoData.referees.forEach(e => {
            const liElement = document.createElement("li");
            liElement.innerHTML = e.name
            ulElement.appendChild(liElement);
        })
    } else {
        ulElement.innerHTML = "<li> - </li>"
    }

    document.querySelectorAll(".information").forEach(el => {
        el.querySelector(".time").innerHTML = `${infoData.status.toLowerCase()} - ${time} WIB`
        el.querySelector(".homeTeam .score").innerHTML = infoData.score[0] === null ? "-" : infoData.score[0];
        el.querySelector(".homeTeam .teamName").innerHTML = infoData.team[0];
        el.querySelector(".awayTeam .score").innerHTML = infoData.score[1] === null ? "-" : infoData.score[1];
        el.querySelector(".awayTeam .teamName").innerHTML = infoData.team[1];
    })

    document.querySelectorAll(".competitionName").forEach(el => {
        el.innerHTML = infoData.competition
    })

    document.querySelector(".information .refereesName").innerHTML = "";
    document.querySelector(".information .refereesName").appendChild(ulElement);
}

function setHomeCarousel(infoDatas) {
    const totalData = infoDatas.length;
    const elems = document.querySelectorAll(".carousel.carousel-slider");
    const options = {
        fullWidth: true,
        indicators: true
    }
    const instances = M.Carousel.init(elems, options)

    let counter = 0;

    function startSlideShow() {
        console.log("slideshow started");
        if (timer !== undefined) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            elems.forEach(el => {
                M.Carousel.getInstance(el).next();
                onUserInteract(el)
            })
            startSlideShow()
        }, 5000)
    }

    function stopWhileInteract() {
        console.log(timer);

        if (timer !== undefined) {
            clearTimeout(timer);

            b = setTimeout(() => {
                startSlideShow()
            }, 5000)
        }
    }

    startSlideShow();

    function onUserInteract(el) {
        a = setInterval(() => {
            if (el.className.includes("scrolling")) {
                let newCounter = M.Carousel.getInstance(el).center,
                    tooltip = document.querySelector(".tooltipped");

                newCounter = newCounter < 0 ? (newCounter % totalData) + totalData : newCounter % totalData;

                if (newCounter !== counter) {
                    reRenderInfo(infoDatas[newCounter]);
                    saveDataInit("match", infoDatas[newCounter].id, newCounter);

                    counter = newCounter
                }
            } else {
                clearInterval(a);
            }
        }, 200);
    }

    elems.forEach(el => {
        el.addEventListener("mousedown", function() {
            onUserInteract(el)
            stopWhileInteract()
        })

        el.addEventListener("touchstart", function() {
            onUserInteract(el);
            stopWhileInteract()

        })
    })

    let windowX = window.innerWidth;

    window.addEventListener("resize", function() {
        if (windowX !== window.innerWidth) {
            removeIndicators();
            M.Carousel.init(elems, options);
            elems.forEach(el => {
                M.Carousel.getInstance(el).set(counter)
            })
            windowX = window.innerWidth;
        }
    })
}

function descToArr(data) {
    // depp desctructuring lol

    let {
        awayTeam: { name: awayName },
        competition: { area: { name: areaName, ensignUrl: flagUrl }, name: competition },
        homeTeam: { name: homeName },
        id,
        referees,
        score: { fullTime: { homeTeam: homeScore, awayTeam: awayScore } },
        utcDate,
        status
    } = data;

    if (areaName === "Brazil") {
        flagUrl = "https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg"
    } else if (areaName === "World") {
        flagUrl = "https://upload.wikimedia.org/wikipedia/commons/2/24/The_world_flag_2006.svg"
    }

    // get venue 

    return {
        team: [awayName, homeName],
        flag: [areaName, flagUrl],
        id,
        referees,
        score: [awayScore, homeScore],
        date: utcDate,
        status,
        competition
    }
}

function getHomeData(homeElement) {

    let today = new Date();
    today.setDate(today.getDate())

    today = formatDate(today)

    const fetchUrl = `https://api.football-data.org/v2/matches?dateFrom=${today}&dateTo=${today}`;

    return new Promise(resolve => {
        controllerHome = new AbortController();
        var { signal: signalHome } = controllerHome

        fetchAndCache(fetchUrl, getNewOptions(signalHome), "json")
            .then(responseJson => {
                let datas = [];

                responseJson.matches.forEach(data => {
                    if (data.status === "SCHEDULED") {
                        notifyMatch(data);
                    }
                    datas.push(descToArr(data));
                })

                datas.forEach(data => {
                    homeElement.querySelectorAll(".carousel.carousel-slider.center").forEach(e => {
                        const childElm = document.createElement("div");
                        childElm.className = "carousel-item white-text";
                        childElm.setAttribute("href", `#${data.id}`);
                        childElm.setAttribute("style", `background-image: url(${data.flag[1]});`)

                        e.appendChild(childElm)
                    })
                })
                resolve([homeElement, datas])
            })
    })
}

function getHome() {
    controllerHome = new AbortController();
    var { signal: signalHome } = controllerHome

    fetch("./components/home.html", getNewOptions(signalHome))
        .then(toText)
        .then(responseText => {
            const homeElement = document.createElement("div")
            homeElement.className = "home";

            homeElement.innerHTML = responseText;
            getHomeData(homeElement)
                .then(args => {
                    const [renderedFlag, data] = args;
                    document.querySelector(".page-content").innerHTML = ""
                    document.querySelector(".page-content").appendChild(renderedFlag);

                    setHomeCarousel(data);
                    reRenderInfo(data[0])

                    saveDataInit("match", data[0].id, 0);
                    saveDataInteraction(data);

                    $('.tooltipped').tooltip();
                })
        })
}
// const BRAZIL_FLAG = "https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg";
// const WORLD_FLAG = "https://upload.wikimedia.org/wikipedia/commons/2/24/The_world_flag_2006.svg";
// const EUROPE_FLAG = "https://ak.picdn.net/shutterstock/videos/823771/thumb/1.jpg";

// flags for competition-item

const FLAGS = {
    brazil: "https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg",
    england: "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg",
    europe: "https://ak.picdn.net/shutterstock/videos/823771/thumb/1.jpg",
    france: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg",
    germany: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg",
    italy: "https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg",
    netherlands: "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg",
    portugal: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg",
    spain: "https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg",
    world: "https://upload.wikimedia.org/wikipedia/commons/2/24/The_world_flag_2006.svg"
}

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

// format from yyyy-mm-dd to dd-mm-yyyy

function reverseString(param) {
    // reversing string 
    // https://www.freecodecamp.org/news/how-to-reverse-a-string-in-javascript-in-3-different-ways-75e4763c68cb/

    param = param.split("").reverse().join("");
}

function getDateProp(date) {

    const dateProp = date.split("-");
    console.log(dateProp);

    const obj = {
        d: dateProp[2],
        m: MONTHS[parseInt(dateProp[1]) - 1],
        y: dateProp[0]
    };

    return obj
}


// controller for abort fetch request
var controllerCompetitions = new AbortController();
var { signal: signalCompetitions } = controllerCompetitions


function getCompetitionsContent(fetchSignal) {
    const fetchUrl = "https://api.football-data.org/v2/competitions?plan=TIER_ONE";
    addLoader(document.querySelector(".competitionsAndSaved .container .row.page-data"));

    fetchAndCache(fetchUrl, getNewOptions(fetchSignal), "json")
        .then(responseJson => {
            // set filterable array of area and name the competitons
            let filterableCompetitionsData = [];
            removeLoader(document.querySelector(".competitionsAndSaved .container .row.page-data"))

            responseJson.competitions.forEach(data => {

                filterableCompetitionsData.push({
                    area: data.area.name,
                    name: data.name
                });

                renderCompetitions(data);
            })
            filterSearch(filterableCompetitionsData, responseJson.competitions)
        });

}


function renderCompetitions(data) {
    const areaName = data.area.name;
    const flagUrl = FLAGS[areaName.toLowerCase()];

    const cardWrapElement = document.createElement("div");
    cardWrapElement.className = "col l3 m6 s12";

    cardWrapElement.innerHTML = `<div class="card">
                    <div class="card-image">
                        <img src="${flagUrl}">

                    </div>
                    <div class="card-content">
                        <p>${data.name} - ${areaName}</p>
                    </div>
                    <div class="card-action right-align">
                        <a href="#competitions?${data.id}">See Details</a>
                    </div>
                </div>`;

    document.querySelector(".competitionsAndSaved .container .row.page-data").appendChild(cardWrapElement);
}

function filterSearch(filters, allData) {
    document.querySelectorAll(".competitionsAndSaved input.validate").forEach(el => {
        el.addEventListener("keyup", function(e) {
            const inputFilter = e.target.value.toLowerCase()

            let availableFilter = false;
            document.querySelector(".competitionsAndSaved .container .row.page-data").innerHTML = "";

            filters.forEach((filter, idx) => {
                if (filter.area.toLowerCase().includes(inputFilter) || filter.name.toLowerCase().includes(inputFilter)) {
                    availableFilter = true;
                    renderCompetitions(allData[idx]);
                }
            })

            if (!availableFilter) {
                document.querySelector(".competitionsAndSaved .container .row.page-data").innerHTML = "No data available";
            }
        })
    })
}



function renderCompetitionItem(data) {
    const {
        area: { name: area },
        name,
        code,
        currentSeason: { id: currentSeasonId },
        seasons
    } = data

    // clearing loader
    removeLoader(document.querySelector(".competition"));
    // processing date datas

    document.querySelectorAll(".competition .flag").forEach(el => {
        el.style.backgroundImage = `url("${FLAGS[area.toLowerCase()]}")`;
    });

    document.querySelector(".competitionName").innerHTML = `${name} (${code})`;
    document.querySelector(".competitionArea").innerHTML = area;

    seasons.forEach(season => {

        const {
            d: startDay,
            m: startMonth,
            y: startYear
        } = getDateProp(season.startDate);

        const {
            d: endDay,
            m: endMonth,
            y: endYear
        } = getDateProp(season.endDate);

        const liElement = document.createElement("li");
        liElement.innerHTML = `<div class="collapsible-header"><i class="material-icons">whatshot</i>${startMonth} ${startYear} ${season.id === currentSeasonId ? "(current season)" : ""}
        </div>
        <div class="collapsible-body">
            <ul>
                <li>Start Date : ${startDay} ${startMonth} ${startYear} </li>
                <li>End Date : ${endDay} ${endMonth} ${endYear} </li>
                <li>Winner : ${season.winner === null ? " - " : season.winner.name}</li>
            </ul>
        </div>`;

        document.querySelector(".competition ul.collapsible").appendChild(liElement);

    })
}

function getCompetitionItem(id, fetchSignal) {

    const fetchUrl = `https://api.football-data.org/v2/competitions/${id}`;

    fetchAndCache(fetchUrl, getNewOptions(fetchSignal), "json")
        .then(responseJson => {
            renderCompetitionItem(responseJson);
            saveDataInit("competition", id);
            saveDataInteraction(responseJson);
        })
}


function getCompetitions(id = "") {
    var controllerCompetitions = new AbortController();
    var { signal: signalCompetitions } = controllerCompetitions

    if (id) {
        fetch("./components/competition-item.html", getNewOptions(signalCompetitions))
            .then(toText)
            .then(responseText => {
                document.querySelector(".page-content").innerHTML = responseText;
                getCompetitionItem(id, signalCompetitions)

                // materialize things
                $('.materialboxed').materialbox();
                $('.collapsible').collapsible();
                $('.tooltipped').tooltip();
            })
    } else {

        fetch("./components/competitionsAndSaved.html", getNewOptions(signalCompetitions))
            .then(toText)
            .then(responseText => {
                document.querySelector(".page-content").innerHTML = responseText;
                getCompetitionsContent(signalCompetitions);
            })
    }

}