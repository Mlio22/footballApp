import { toText, ICONS, TEXTS } from "../utils.js";

export function getNavBar() {
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
            }
            $(".sidenav").sidenav("close");

        })
    })
}

export function switchNav(nav) {
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