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

function getSavedMatch(id) {
    fetch("./components/home.html", getNewOptions(signalSaved))
        .then(toText)
        .then(responseText => {
            document.querySelector(".page-content").innerHTML = responseText

            // a litte exception
            document.querySelector(".fixed-action-btn a").setAttribute("data-tooltip", "delete");
            document.querySelector(".fixed-action-btn i").innerHTML = "delete";

            getSaved("match", parseInt(id))
                .then(response => {
                    console.log(response);
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
        })
}

function getSavedCompetition(id) {
    fetch("./components/competition-item.html", getNewOptions(signalSaved))
        .then(toText)
        .then(responseText => {
            document.querySelector(".page-content").innerHTML = responseText

            // a litte exception
            document.querySelector(".fixed-action-btn a").setAttribute("data-tooltip", "delete");
            document.querySelector(".fixed-action-btn i").innerHTML = "delete"

            getSaved("competition", parseInt(id))
                .then(response => {
                    // since it doing in the same way and result
                    renderCompetitionItem(response)
                })
            $('.collapsible').collapsible();
            $('.tooltipped').tooltip();
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