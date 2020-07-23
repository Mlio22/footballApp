import { getHome, StopHomeSlideshows } from "./components/home.js"
import { getCompetitions } from "./components/competitions.js"
import { getSavedPage } from "./components/saved.js"
import { switchNav } from "./components/nav.js"
import { checkSaved, saveItem } from "./db.js"

const API_HEADER = {
    "X-Auth-Token": "9acaf4710891457ea9104fa7c96cbd1c"
}

export const ICONS = {
    home: "tv",
    competitions: "leaderboard",
    saved: "save"
}

export const TEXTS = {
    home: "Latest Matches",
    competitions: "Competitions",
    saved: "Saved Pages"
}

export function getNewOptions(signal) {
    return {
        headers: API_HEADER,
        signal: signal
    }
}

export function toText(response) {
    return new Promise(resolve => {
        resolve(response.text())
    })
}

export function toJson(response) {
    return new Promise(resolve => {
        resolve(response.json())
    })
}

export function getTimeMatch(time) {
    time = new Date(time);
    time = time.toString()
    time = time.split(" ")[4].slice(0, 5);
    return time
}


export function addLoader(element) {
    element.innerHTML = `<div class="ball-loader-wrapper">
    <div class="ball-loader">
        <div></div>
    </div>
</div>`;
}

export function removeLoader(element) {
    try {
        let wrapper = element.querySelector(".ball-loader-wrapper");
        if (wrapper) wrapper.remove();
    } catch (err) {}
}

// saves file 
export function saveDataInit(type, id, index = null) {

    const tooltipBtn = document.querySelector(".save-btn .tooltipped");
    let msg = ""
    checkSaved(type, id)
        .then(response => {
            if (response) {
                msg = "Already Saved";
                tooltipBtn.classList.add("disabled")
            } else {
                msg = "Save";
                tooltipBtn.classList.remove("disabled");
            }
            tooltipBtn.setAttribute("data-tooltip", msg);
            tooltipBtn.setAttribute("data-type", type);
            tooltipBtn.setAttribute("data-index", index);

            $('.tooltipped').tooltip("close");
        })
}

export function saveDataInteraction(data) {
    document.querySelector(".save-btn .tooltipped").addEventListener("click", function() {
        let data_tooltip = this.attributes[2].value,
            data_index = parseInt(this.attributes[4].value),
            data_type = this.attributes[3].value;

        if (!(data_tooltip === "Already Saved" || data_tooltip === "Saved")) {
            $(".tooltipped").tooltip("close");

            let saveData = data_index + 1 ? data[data_index] : data;
            saveItem(data_type, saveData)
                .then(() => {
                    this.classList.add("disabled");
                    this.setAttribute("data-tooltip", "Saved");
                    setTimeout(() => {
                        $('.tooltipped').tooltip("open");
                        setTimeout(() => {
                            $(".tooltipped").tooltip("close");
                        }, 1000)
                    }, 200)
                });
        } else {
            this.setAttribute("data-tooltip", "Already Saved");
            $('.tooltipped').tooltip("open");
        }
    })
}

export function switchUrl(e = "") {
    const url = window.location.href;
    let param = url.split("#")[1] || "";

    addLoader(document.querySelector(".page-content"));
    StopHomeSlideshows();
    // abortAll();

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
        }
        getSavedPage(type, id);
    } else {
        redirectHome(param);
    }

    param = param.split("?")[0] || param;
    switchNav(param || "home");

    return param
}

function redirectHome(param) {
    window.location.href = param === param.toLowerCase() ? "#home" : `#${param.toLowerCase()}`;
}