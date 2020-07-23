// controller for abort fetch request
let controllerHome = new AbortController();
let { signal: signalHome } = controllerHome
import { getNewOptions, toText, toJson, getTimeMatch, saveDataInit, saveDataInteraction } from "../utils.js";
import { notifyMatch } from "../background.js"

let timer, a, b

let isHomeused = true;


// format date to yyyy-mm-dd
// https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd

function formatDate(d) {
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
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
    if (isHomeused) {
        try {
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
        } catch (e) {}
    }


}


function setHomeCarousel(infoDatas) {
    let totalData = infoDatas.length;
    let elems = document.querySelectorAll(".carousel.carousel-slider");
    const options = {
        fullWidth: true,
        indicators: true
    }

    M.Carousel.init(elems, options)

    let counter = 0;

    function startSlideShow() {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setInterval(() => {
            if (isHomeused) {
                elems.forEach((el) => {
                    M.Carousel.getInstance(el).next();
                })
                onUserInteract(screen.width > 992 ? elems[0] : elems[1]);
            } else {
                clearInterval(timer);
            }
        }, 5000)
    }

    function stopWhileInteract() {

        if (timer) {
            clearTimeout(timer);

            b = setTimeout(() => {
                if (isHomeused) {
                    startSlideShow()

                } else {
                    clearTimeout(b);
                }
            }, 5000)
        }
    }

    startSlideShow();

    function onUserInteract(el) {
        if (a) clearInterval(a);
        if (isHomeused) {
            a = setInterval(() => {
                if (el.className.includes("scrolling")) {
                    let newCounter = M.Carousel.getInstance(el).center

                    newCounter = newCounter < 0 ? ((newCounter % totalData) + totalData) % totalData : newCounter % totalData;

                    if (newCounter !== counter) {
                        console.log(newCounter);

                        reRenderInfo(infoDatas[newCounter]);
                        saveDataInit("match", infoDatas[newCounter].id, newCounter);
                        counter = newCounter
                    }

                } else {
                    clearInterval(a);
                }
            }, 300);
        } else {
            clearInterval(a);
        }
    }

    elems.forEach(el => {
        el.addEventListener("mousedown", function() {
            onUserInteract(el)
            stopWhileInteract()
        })

        el.addEventListener("touchstart", function() {
            console.log("started");
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

export function StopHomeSlideshows() {
    try {
        clearInterval(timer)
        clearInterval(a);
        clearTimeout(b);
    } catch (e) {}
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
        let { signal: signalHome } = controllerHome

        fetch(fetchUrl, getNewOptions(signalHome))
            .then(toJson)
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

export function getHome() {
    isHomeused = true
    controllerHome = new AbortController();
    let { signal: signalHome } = controllerHome

    StopHomeSlideshows();

    fetch("./components/home.html", getNewOptions(signalHome))
        .then(toText)
        .then(responseText => {
            StopHomeSlideshows();

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

export function abortHome() {
    isHomeused = false;
    StopHomeSlideshows();
    try {
        controllerHome.abort();
    } catch (e) {

    }
}