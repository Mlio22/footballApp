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