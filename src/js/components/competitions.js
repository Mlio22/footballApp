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