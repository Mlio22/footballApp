!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=9)}([function(e,n,t){"use strict";e.exports=function(e){var n=[];return n.toString=function(){return this.map((function(n){var t=function(e,n){var t=e[1]||"",r=e[3];if(!r)return t;if(n&&"function"==typeof btoa){var o=(a=r,c=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),l="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(c),"/*# ".concat(l," */")),i=r.sources.map((function(e){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(e," */")}));return[t].concat(i).concat([o]).join("\n")}var a,c,l;return[t].join("\n")}(n,e);return n[2]?"@media ".concat(n[2]," {").concat(t,"}"):t})).join("")},n.i=function(e,t,r){"string"==typeof e&&(e=[[null,e,""]]);var o={};if(r)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(o[a]=!0)}for(var c=0;c<e.length;c++){var l=[].concat(e[c]);r&&o[l[0]]||(t&&(l[2]?l[2]="".concat(t," and ").concat(l[2]):l[2]=t),n.push(l))}},n}},function(e,n,t){"use strict";!function(){function n(e){return Array.prototype.slice.call(e)}function t(e){return new Promise((function(n,t){e.onsuccess=function(){n(e.result)},e.onerror=function(){t(e.error)}}))}function r(e,n,r){var o,i=new Promise((function(i,a){t(o=e[n].apply(e,r)).then(i,a)}));return i.request=o,i}function o(e,n,t){var o=r(e,n,t);return o.then((function(e){if(e)return new d(e,o.request)}))}function i(e,n,t){t.forEach((function(t){Object.defineProperty(e.prototype,t,{get:function(){return this[n][t]},set:function(e){this[n][t]=e}})}))}function a(e,n,t,o){o.forEach((function(o){o in t.prototype&&(e.prototype[o]=function(){return r(this[n],o,arguments)})}))}function c(e,n,t,r){r.forEach((function(r){r in t.prototype&&(e.prototype[r]=function(){return this[n][r].apply(this[n],arguments)})}))}function l(e,n,t,r){r.forEach((function(r){r in t.prototype&&(e.prototype[r]=function(){return o(this[n],r,arguments)})}))}function s(e){this._index=e}function d(e,n){this._cursor=e,this._request=n}function p(e){this._store=e}function u(e){this._tx=e,this.complete=new Promise((function(n,t){e.oncomplete=function(){n()},e.onerror=function(){t(e.error)},e.onabort=function(){t(e.error)}}))}function m(e,n,t){this._db=e,this.oldVersion=n,this.transaction=new u(t)}function h(e){this._db=e}i(s,"_index",["name","keyPath","multiEntry","unique"]),a(s,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),l(s,"_index",IDBIndex,["openCursor","openKeyCursor"]),i(d,"_cursor",["direction","key","primaryKey","value"]),a(d,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach((function(e){e in IDBCursor.prototype&&(d.prototype[e]=function(){var n=this,r=arguments;return Promise.resolve().then((function(){return n._cursor[e].apply(n._cursor,r),t(n._request).then((function(e){if(e)return new d(e,n._request)}))}))})})),p.prototype.createIndex=function(){return new s(this._store.createIndex.apply(this._store,arguments))},p.prototype.index=function(){return new s(this._store.index.apply(this._store,arguments))},i(p,"_store",["name","keyPath","indexNames","autoIncrement"]),a(p,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),l(p,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),c(p,"_store",IDBObjectStore,["deleteIndex"]),u.prototype.objectStore=function(){return new p(this._tx.objectStore.apply(this._tx,arguments))},i(u,"_tx",["objectStoreNames","mode"]),c(u,"_tx",IDBTransaction,["abort"]),m.prototype.createObjectStore=function(){return new p(this._db.createObjectStore.apply(this._db,arguments))},i(m,"_db",["name","version","objectStoreNames"]),c(m,"_db",IDBDatabase,["deleteObjectStore","close"]),h.prototype.transaction=function(){return new u(this._db.transaction.apply(this._db,arguments))},i(h,"_db",["name","version","objectStoreNames"]),c(h,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach((function(e){[p,s].forEach((function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t=n(arguments),r=t[t.length-1],o=this._store||this._index,i=o[e].apply(o,t.slice(0,-1));i.onsuccess=function(){r(i.result)}})}))})),[s,p].forEach((function(e){e.prototype.getAll||(e.prototype.getAll=function(e,n){var t=this,r=[];return new Promise((function(o){t.iterateCursor(e,(function(e){e?(r.push(e.value),void 0===n||r.length!=n?e.continue():o(r)):o(r)}))}))})}));var f={open:function(e,n,t){var o=r(indexedDB,"open",[e,n]),i=o.request;return i&&(i.onupgradeneeded=function(e){t&&t(new m(i.result,e.oldVersion,i.transaction))}),o.then((function(e){return new h(e)}))},delete:function(e){return r(indexedDB,"deleteDatabase",[e])}};e.exports=f,e.exports.default=e.exports}()},function(e,n,t){var r=t(3),o=t(4);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var i={insert:"head",singleton:!1};r(o,i);e.exports=o.locals||{}},function(e,n,t){"use strict";var r,o=function(){return void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r},i=function(){var e={};return function(n){if(void 0===e[n]){var t=document.querySelector(n);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(e){t=null}e[n]=t}return e[n]}}(),a=[];function c(e){for(var n=-1,t=0;t<a.length;t++)if(a[t].identifier===e){n=t;break}return n}function l(e,n){for(var t={},r=[],o=0;o<e.length;o++){var i=e[o],l=n.base?i[0]+n.base:i[0],s=t[l]||0,d="".concat(l," ").concat(s);t[l]=s+1;var p=c(d),u={css:i[1],media:i[2],sourceMap:i[3]};-1!==p?(a[p].references++,a[p].updater(u)):a.push({identifier:d,updater:g(u,n),references:1}),r.push(d)}return r}function s(e){var n=document.createElement("style"),r=e.attributes||{};if(void 0===r.nonce){var o=t.nc;o&&(r.nonce=o)}if(Object.keys(r).forEach((function(e){n.setAttribute(e,r[e])})),"function"==typeof e.insert)e.insert(n);else{var a=i(e.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(n)}return n}var d,p=(d=[],function(e,n){return d[e]=n,d.filter(Boolean).join("\n")});function u(e,n,t,r){var o=t?"":r.media?"@media ".concat(r.media," {").concat(r.css,"}"):r.css;if(e.styleSheet)e.styleSheet.cssText=p(n,o);else{var i=document.createTextNode(o),a=e.childNodes;a[n]&&e.removeChild(a[n]),a.length?e.insertBefore(i,a[n]):e.appendChild(i)}}function m(e,n,t){var r=t.css,o=t.media,i=t.sourceMap;if(o?e.setAttribute("media",o):e.removeAttribute("media"),i&&btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}var h=null,f=0;function g(e,n){var t,r,o;if(n.singleton){var i=f++;t=h||(h=s(n)),r=u.bind(null,t,i,!1),o=u.bind(null,t,i,!0)}else t=s(n),r=m.bind(null,t,n),o=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)};return r(e),function(n){if(n){if(n.css===e.css&&n.media===e.media&&n.sourceMap===e.sourceMap)return;r(e=n)}else o()}}e.exports=function(e,n){(n=n||{}).singleton||"boolean"==typeof n.singleton||(n.singleton=o());var t=l(e=e||[],n);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var r=0;r<t.length;r++){var o=c(t[r]);a[o].references--}for(var i=l(e,n),s=0;s<t.length;s++){var d=c(t[s]);0===a[d].references&&(a[d].updater(),a.splice(d,1))}t=i}}}},function(e,n,t){var r=t(0),o=t(5),i=t(6),a=t(7),c=t(8);(n=r(!1)).i(o),n.i(i,"(min-width: 992px)"),n.i(a,"(min-width:600px) and (max-width: 992px)"),n.i(c,"(max-width: 600px)"),n.push([e.i,"/* because of issues, pwa buttons are disabled :( */\r\n\r\n\r\n/* @import \"./pwa-customs.css\" (max-width: 600px) and (display-mode: standalone); */\r\n\r\n* {\r\n    padding: 0;\r\n    margin: 0;\r\n}\r\n\r\nbody {\r\n    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\r\n}\r\n\r\n.custom-theme {\r\n    background-color: #00658b !important;\r\n}\r\n\r\n.ball-icon {\r\n    height: 55px;\r\n}\r\n\r\n.indicator-item {\r\n    background-color: rgba(51, 48, 48, 0.5) !important;\r\n}\r\n\r\n.indicator-item.active {\r\n    background-color: #000 !important;\r\n}\r\n\r\n.home {\r\n    color: #707070;\r\n}\r\n\r\n.home .time {\r\n    text-transform: capitalize;\r\n}\r\n\r\n.competitionsAndSaved .container {\r\n    margin-top: 20px;\r\n}\r\n\r\n.competitionsAndSaved .card-content {\r\n    height: 100px !important;\r\n}\r\n\r\n.competitionsAndSaved .card-image img {\r\n    height: 150px !important;\r\n}\r\n\r\n.competitionsAndSaved .card-action.right-align a {\r\n    margin-right: 0 !important;\r\n}\r\n\r\n.competition .collapsible-header,\r\n.competition .collapsible-header:focus,\r\n.competition .collapsible-body {\r\n    background-color: #0277bd;\r\n    border-bottom: 1px #123d57 solid;\r\n}\r\n\r\n.competition .collapsible-body {\r\n    border-bottom: 0px !important;\r\n}\r\n\r\n.savedFlag {\r\n    height: inherit;\r\n    background-size: cover;\r\n}\r\n\r\n\r\n/* coloring for inputs and labels */\r\n\r\n.input-field input:focus+label,\r\n.material-icons.prefix.active {\r\n    color: #00658b !important\r\n}\r\n\r\n.row .input-field input:focus {\r\n    border-bottom: 1px solid #00658b !important;\r\n    box-shadow: 0 1px 0 0 #00658b !important\r\n}",""]),e.exports=n},function(e,n,t){(n=t(0)(!1)).push([e.i," @keyframes ball-loader {\r\n     0%,\r\n     100% {\r\n         animation-timing-function: cubic-bezier(0.45, 0, 0.9, 0.55)\r\n     }\r\n     0%,\r\n     50%,\r\n     100% {\r\n         transform: translate(0, 0)\r\n     }\r\n     25%,\r\n     75% {\r\n         transform: translate(0, 120px);\r\n         animation-timing-function: cubic-bezier(0, 0.45, 0.55, 0.9);\r\n     }\r\n }\r\n \r\n .ball-loader div {\r\n     position: absolute;\r\n     width: 40px;\r\n     height: 40px;\r\n     border-radius: 50%;\r\n     background: #0277bd;\r\n     left: 80px;\r\n     top: 20px;\r\n     animation: ball-loader 2s linear infinite;\r\n }\r\n \r\n .ball-loader-wrapper {\r\n     width: 200px;\r\n     height: 200px;\r\n     display: inline-block;\r\n     overflow: hidden;\r\n     background: transparent;\r\n     position: absolute;\r\n     top: 50%;\r\n     left: 50%;\r\n     transform: translate(-50%, -50%);\r\n }\r\n \r\n .ball-loader {\r\n     width: 100%;\r\n     height: 100%;\r\n     position: relative;\r\n     transform: translateZ(0) scale(1);\r\n     backface-visibility: hidden;\r\n     transform-origin: 0 0;\r\n     /* see note above */\r\n }\r\n \r\n .ball-loader div {\r\n     box-sizing: content-box;\r\n }\r\n /* generated by https://loading.io/ */",""]),e.exports=n},function(e,n,t){(n=t(0)(!1)).push([e.i,"/* navs */\r\n\r\n.nav-wrapper {\r\n    margin: 0 50px;\r\n}\r\n\r\n.logo-image {\r\n    width: 50px;\r\n    margin-top: 10px;\r\n}\r\n\r\n.nav-wrapper p {\r\n    display: inline;\r\n    margin: 0;\r\n    margin-left: 10px;\r\n    font-size: 1em;\r\n}\r\n\r\n\r\n/* home.html */\r\n\r\n.home {\r\n    margin-top: 20px;\r\n}\r\n\r\n.home .flag {\r\n    height: 350px !important;\r\n}\r\n\r\n.flag .carousel-item {\r\n    background-repeat: no-repeat;\r\n    background-size: cover !important;\r\n    height: 350px !important;\r\n    min-height: initial !important;\r\n}\r\n\r\n.carousel.carousel-slider.center {\r\n    height: 350px;\r\n}\r\n\r\n.home .information {\r\n    margin-top: 20px;\r\n    border-radius: 20px;\r\n    width: 100%;\r\n    height: max-content;\r\n    background-color: #f5f5f5;\r\n    padding: 10px 0;\r\n    text-align: center;\r\n}\r\n\r\n.home .time,\r\n.home .place {\r\n    font-size: 16px;\r\n}\r\n\r\n.home .match {\r\n    font-size: 24px;\r\n    margin: auto;\r\n    display: flex;\r\n    justify-content: center;\r\n}\r\n\r\n.match li:not(.vsDivider) {\r\n    flex-basis: 48%;\r\n}\r\n\r\n.vsDivider {\r\n    margin: auto 80px;\r\n}\r\n\r\n.score {\r\n    margin-top: 20px;\r\n    margin-bottom: 40px;\r\n    font-size: 2em;\r\n}\r\n\r\n.versus {\r\n    margin-top: 5px;\r\n    font-size: 30px;\r\n}\r\n\r\n.teamName {\r\n    margin-top: 40px;\r\n    margin-bottom: 20px;\r\n}\r\n\r\n\r\n/* competitions and saved*/\r\n\r\n.competitionsAndSaved .filterBar {\r\n    border-radius: 10px;\r\n}\r\n\r\n\r\n/* competition-item.html */\r\n\r\n.competition {\r\n    margin-top: 20px;\r\n    margin-bottom: 50px;\r\n}\r\n\r\n.competition .flag {\r\n    background-size: cover;\r\n    height: 350px !important;\r\n    width: 100%;\r\n    border-radius: 20px;\r\n}\r\n\r\n.competition .descriptions {\r\n    margin-top: 15px;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.competition .descriptions .competitionName {\r\n    font-size: 2em;\r\n}",""]),e.exports=n},function(e,n,t){(n=t(0)(!1)).push([e.i,"/* navs */\r\n\r\n.nav-wrapper {\r\n    margin: 0 20px;\r\n}\r\n\r\n.logo-image {\r\n    width: 40px;\r\n    margin-top: 15px;\r\n}\r\n\r\n.nav-wrapper p {\r\n    display: inline;\r\n    margin: 0;\r\n    margin-left: 10px;\r\n    font-size: 0.75em;\r\n}\r\n\r\nul.dropdown-content {\r\n    top: 0 !important;\r\n    margin-top: 64px;\r\n}\r\n\r\n\r\n/* home.html */\r\n\r\n.home {\r\n    margin-top: 10px;\r\n}\r\n\r\n.home .flag {\r\n    height: 170px !important;\r\n}\r\n\r\n.flag>* {\r\n    height: 170px !important;\r\n}\r\n\r\n.flag .carousel-item {\r\n    background-repeat: no-repeat;\r\n    background-size: cover !important;\r\n    height: 170px !important;\r\n    min-height: initial !important;\r\n}\r\n\r\n.home .information {\r\n    margin-top: 20px;\r\n    border-radius: 20px;\r\n    width: 100%;\r\n    height: max-content;\r\n    background-color: #f5f5f5;\r\n    padding: 10px 0;\r\n    text-align: center;\r\n}\r\n\r\n.home .time,\r\n.home .place {\r\n    font-size: 12px;\r\n}\r\n\r\n.home .score {\r\n    font-size: 2em;\r\n}\r\n\r\n.home .match {\r\n    font-size: 15px;\r\n    margin: auto;\r\n    display: flex;\r\n    justify-content: center;\r\n}\r\n\r\n.match li:not(.vsDivider) {\r\n    flex-basis: 48%;\r\n}\r\n\r\n.vsDivider {\r\n    margin: auto;\r\n}\r\n\r\n.versus {\r\n    font-size: 20px;\r\n}\r\n\r\n.teamName {\r\n    margin-top: 20px;\r\n    margin-bottom: 5px;\r\n}\r\n\r\n\r\n/* competition */\r\n\r\n.competition {\r\n    margin-top: 20px;\r\n    margin-bottom: 50px;\r\n}\r\n\r\n.competition .flag {\r\n    background-size: cover;\r\n    height: 150px !important;\r\n    width: 100%;\r\n    border-radius: 20px;\r\n}\r\n\r\n.competition .descriptions {\r\n    margin-top: 15px;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.competition .descriptions .competitionName {\r\n    font-size: 1.7em;\r\n}",""]),e.exports=n},function(e,n,t){(n=t(0)(!1)).push([e.i,".pwa {\r\n    display: none;\r\n}\r\n\r\n\r\n/* navs */\r\n\r\n.sidenav-triggerer {\r\n    text-align: center;\r\n    margin-top: 20px;\r\n    background: #0277bd;\r\n    width: max-content;\r\n    border-top-right-radius: 20px;\r\n    border-bottom-right-radius: 20px;\r\n    position: fixed;\r\n    top: 100px;\r\n    opacity: .6;\r\n    z-index: 3;\r\n    cursor: pointer;\r\n    transition: .2s all;\r\n}\r\n\r\n.sidenav-triggerer:hover {\r\n    opacity: 1;\r\n}\r\n\r\n.sidenav-triggerer i {\r\n    color: black;\r\n    margin-top: 15px;\r\n    height: 45px;\r\n    width: 45px;\r\n}\r\n\r\n.sidebar-icon {\r\n    height: 100px;\r\n    background-color: #0277bd;\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.sidebar-icon img {\r\n    margin: 25px 0;\r\n}\r\n\r\n.sidenav a {\r\n    color: #F0F0F0 !important;\r\n}\r\n\r\n.sidenav .active {\r\n    background-color: #01579B !important;\r\n}\r\n\r\n.sidenav li i {\r\n    margin-top: 10px;\r\n}\r\n\r\n\r\n/* home.html */\r\n\r\n.home .col {\r\n    padding: 0 !important;\r\n}\r\n\r\n.home .flag {\r\n    height: 200px !important;\r\n}\r\n\r\n.flag>* {\r\n    height: 200px !important;\r\n}\r\n\r\n.flag .carousel-item {\r\n    background-repeat: no-repeat;\r\n    background-size: cover !important;\r\n    height: 200px !important;\r\n    min-height: initial !important;\r\n}\r\n\r\n.information {\r\n    margin-top: 5px;\r\n    text-align: center;\r\n}\r\n\r\n.home .time {\r\n    font-size: 12px;\r\n}\r\n\r\n.home .match {\r\n    font-size: 1.2em;\r\n    margin: auto;\r\n    display: flex;\r\n    justify-content: center;\r\n}\r\n\r\n.home .score {\r\n    font-size: 2em;\r\n}\r\n\r\n.match li:not(.vsDivider) {\r\n    flex-grow: 1;\r\n    flex-basis: 48%;\r\n    margin: 0 5px;\r\n}\r\n\r\n.match li {\r\n    margin: auto;\r\n}\r\n\r\n.match .vsDivider {\r\n    margin: auto 20px;\r\n}\r\n\r\n.versus {\r\n    font-size: 20px;\r\n}\r\n\r\n.teamName {\r\n    margin-top: 20px;\r\n    margin-bottom: 5px;\r\n}\r\n\r\n.divider {\r\n    background-color: #707070 !important;\r\n    margin: 0 10px;\r\n    margin-top: 20px;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.matchDetails {\r\n    text-align: left;\r\n    margin: 0 20px;\r\n}\r\n\r\n.matchDetails>div {\r\n    margin-bottom: 15px;\r\n}\r\n\r\n.matchDetails>div:not(.detailHeader) {\r\n    margin-left: 15px;\r\n    display: flex;\r\n}\r\n\r\n.lefte {\r\n    flex-basis: 40%;\r\n}\r\n\r\n.matchDetails ul li {\r\n    margin-bottom: 15px;\r\n}\r\n\r\n\r\n/* competitions */\r\n\r\n.competition {\r\n    margin-bottom: 50px;\r\n}\r\n\r\n.competition .flag {\r\n    background-size: cover;\r\n    height: 150px !important;\r\n    width: 100%;\r\n}\r\n\r\n.competition .descriptions {\r\n    margin-top: 15px;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.competition .descriptions .competitionName {\r\n    font-size: 1.7em;\r\n}",""]),e.exports=n},function(e,n,t){"use strict";t.r(n);t(2);let r=!1;let o=0;function i(e){if(0===o&&r){const n=new Date(e.utcDate)-Date.now();o=setTimeout(()=>{!function(e,n){const t={body:`${n} VS ${e} Has been Started`,icon:"./src/icons/ball2.ico",badge:"./src/icons/ball2.ico",tag:"match-notification",renotify:!0,vibrate:[300,300]};"granted"===Notification.permission&&navigator.serviceWorker.ready.then(e=>{e.showNotification("KICK OFF!",t)}).catch(e=>console.error(e))}(e.awayTeam.name,e.homeTeam.name)},n)}}function a(e){const n=(e+"=".repeat((4-e.length%4)%4)).replace(/-/g,"+").replace(/_/g,"/"),t=window.atob(n),r=new Uint8Array(t.length);for(let e=0;e<t.length;++e)r[e]=t.charCodeAt(e);return r}"Notification"in window?(console.log("requesting permission for notification"),Notification.requestPermission().then(e=>"denied"===e?console.log("notification denied"):"default"===e?console.log("notification exited"):(r=!0,console.log("notification granted")))):console.error("Notification is not supported");let c,l,s,d=new AbortController,{signal:p}=d,u=!0;function m(e){if(u)try{let n=O(e.date);const t=document.createElement("ul");e.referees.length>0?e.referees.forEach(e=>{const n=document.createElement("li");n.innerHTML=e.name,t.appendChild(n)}):t.innerHTML="<li> - </li>",document.querySelectorAll(".information").forEach(t=>{t.querySelector(".time").innerHTML=`${e.status.toLowerCase()} - ${n} WIB`,t.querySelector(".homeTeam .score").innerHTML=null===e.score[0]?"-":e.score[0],t.querySelector(".homeTeam .teamName").innerHTML=e.team[0],t.querySelector(".awayTeam .score").innerHTML=null===e.score[1]?"-":e.score[1],t.querySelector(".awayTeam .teamName").innerHTML=e.team[1]}),document.querySelectorAll(".competitionName").forEach(n=>{n.innerHTML=e.competition}),document.querySelector(".information .refereesName").innerHTML="",document.querySelector(".information .refereesName").appendChild(t)}catch(e){}}function h(e){let n=e.length,t=document.querySelectorAll(".carousel.carousel-slider");const r={fullWidth:!0,indicators:!0};M.Carousel.init(t,r);let o=0;function i(){c&&clearTimeout(c),c=setInterval(()=>{u?(t.forEach(e=>{M.Carousel.getInstance(e).next()}),d(screen.width>992?t[0]:t[1])):clearInterval(c)},5e3)}function a(){c&&(clearTimeout(c),s=setTimeout(()=>{u?i():clearTimeout(s)},5e3))}function d(t){l&&clearInterval(l),u?l=setInterval(()=>{if(t.className.includes("scrolling")){let r=M.Carousel.getInstance(t).center;r=r<0?(r%n+n)%n:r%n,r!==o&&(console.log(r),m(e[r]),U("match",e[r].id,r),o=r)}else clearInterval(l)},300):clearInterval(l)}i(),t.forEach(e=>{e.addEventListener("mousedown",(function(){d(e),a()})),e.addEventListener("touchstart",(function(){console.log("started"),d(e),a()}))});let p=window.innerWidth;window.addEventListener("resize",(function(){p!==window.innerWidth&&(document.querySelectorAll(".carousel ul.indicators").forEach(e=>{e.remove()}),M.Carousel.init(t,r),t.forEach(e=>{M.Carousel.getInstance(e).set(o)}),p=window.innerWidth)}))}function f(){try{clearInterval(c),clearInterval(l),clearTimeout(s)}catch(e){}}function g(){u=!0,d=new AbortController;let{signal:e}=d;f(),fetch("./components/home.html",z(e)).then(P).then(e=>{f();const n=document.createElement("div");n.className="home",n.innerHTML=e,function(e){let n=new Date;n.setDate(n.getDate()),n=function(e){let n=""+(e.getMonth()+1),t=""+e.getDate(),r=e.getFullYear();return n.length<2&&(n="0"+n),t.length<2&&(t="0"+t),[r,n,t].join("-")}(n);const t=`https://api.football-data.org/v2/matches?dateFrom=${n}&dateTo=${n}`;return new Promise(n=>{d=new AbortController;let{signal:r}=d;fetch(t,z(r)).then(B).then(t=>{let r=[];t.matches.forEach(e=>{"SCHEDULED"===e.status&&i(e),r.push(function(e){let{awayTeam:{name:n},competition:{area:{name:t,ensignUrl:r},name:o},homeTeam:{name:i},id:a,referees:c,score:{fullTime:{homeTeam:l,awayTeam:s}},utcDate:d,status:p}=e;return"Brazil"===t?r="https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg":"World"===t&&(r="https://upload.wikimedia.org/wikipedia/commons/2/24/The_world_flag_2006.svg"),{team:[n,i],flag:[t,r],id:a,referees:c,score:[s,l],date:d,status:p,competition:o}}(e))}),r.forEach(n=>{e.querySelectorAll(".carousel.carousel-slider.center").forEach(e=>{const t=document.createElement("div");t.className="carousel-item white-text",t.setAttribute("href","#"+n.id),t.setAttribute("style",`background-image: url(${n.flag[1]});`),e.appendChild(t)})}),n([e,r])})})}(n).then(e=>{const[n,t]=e;document.querySelector(".page-content").innerHTML="",document.querySelector(".page-content").appendChild(n),h(t),m(t[0]),U("match",t[0].id,0),W(t),$(".tooltipped").tooltip()})})}function v(){u=!1,f();try{d.abort()}catch(e){}}var b=t(1);const y=["match","competition"],w=t.n(b).a.open("footballDb",2,(function(e){console.log("creating IndexedDb Stores"),e.objectStoreNames.contains("match")||e.createObjectStore(y[0],{keyPath:"id"}),e.objectStoreNames.contains("competition")||e.createObjectStore(y[1],{keyPath:"id"})}));function x(e,n){return new Promise(t=>{w.then(r=>{if("match"!==e&&"competition"!==e)return;const o=r.transaction(e,"readwrite").objectStore(e);t(o.get(n))})})}function S(e,n){return new Promise(t=>{w.then(r=>{if("match"!==e&&"competition"!==e)return;const o=r.transaction(e,"readwrite").objectStore(e);t(o.get(parseInt(n)))})})}let k=new AbortController,{signal:T}=k,L=!1;function A(e=null,n=null){L=!0,k=new AbortController;let{signal:t}=k;"match"===e||"competition"===e?"match"===e?function(e){fetch("./components/home.html",z(T)).then(P).then(n=>{document.querySelector(".page-content").innerHTML=n,q("match",e),document.querySelector(".fixed-action-btn i").innerHTML="delete",x("match",parseInt(e)).then(e=>{if(!e)return void(document.querySelector(".page-content").innerHTML="Saved content not found, Maybe you deleted it?");let{competition:n,date:t,flag:r,referees:o,score:i,status:a,team:c}=e;t=O(t),document.querySelectorAll(".home> div").forEach(e=>{e.querySelector(".time").innerHTML=`${a.toLowerCase()} - ${t} WIB`,e.querySelector(".savedFlag").setAttribute("style",`background-image: url('${r[1]}')`),e.querySelector(".homeTeam .score").innerHTML=null===i[0]?" - ":i[0],e.querySelector(".homeTeam .teamName").innerHTML=c[0],e.querySelector(".awayTeam .score").innerHTML=null===i[1]?" - ":i[1],e.querySelector(".awayTeam .teamName").innerHTML=c[1],e.querySelector(".competitionName").innerHTML=n}),document.querySelector(".matchDetails .competitionName").innerHTML=n;const l=document.createElement("ul");o.forEach(e=>l.innerHTML+=`<li>${e.name}</li>`),document.querySelector(".matchDetails .refereesName").appendChild(l),$(".tooltipped").tooltip()}),E()})}(n):function(e){fetch("./components/competition-item.html",z(T)).then(P).then(n=>{document.querySelector(".page-content").innerHTML=n,document.querySelector(".fixed-action-btn i").innerHTML="delete",q("competition",e),x("competition",parseInt(e)).then(e=>{e?ee(e):document.querySelector(".page-content").innerHTML="Saved content not found, Maybe you deleted it?"}),$(".collapsible").collapsible(),$(".tooltipped").tooltip(),E()})}(n):fetch("./components/competitionsAndSaved.html",z(t)).then(P).then(e=>{L&&(document.querySelector(".page-content").innerHTML=e,new Promise(e=>{w.then(n=>{let t=[];y.forEach(e=>{const r=n.transaction(e,"readonly").objectStore(e);t.push(r.getAll())}),Promise.all(t).then(n=>{e(n[0].concat(n[1]))})})}).then(e=>{K(document.querySelector(".competitionsAndSaved .container .row.page-data")),console.log(e),0===e.length&&(document.querySelector(".competitionsAndSaved .container .row.page-data").innerHTML="No saved data available"),e=e.sort((e,n)=>new Date(e.saved_time)-new Date(n.saved_time));let n=[],t=[];var r,o;e.forEach(e=>{let r,o,i=[];"match"===e.type?(r=`${e.team[0]} VS ${e.team[1]}`,o=e.competition,i=[e.id,e.flag[1],`${r} - ${o}`,e.type],_(i)):(r=e.name,o=e.area.name,i=[e.id,V[e.area.name.toLowerCase()],`${r} - ${o}`,e.type],_(i)),t.push(i),n.push({area:o,name:r})}),r=n,o=t,document.querySelectorAll(".competitionsAndSaved input.validate").forEach(e=>{e.addEventListener("keyup",(function(e){const n=e.target.value.toLowerCase();let t=!1;document.querySelector(".competitionsAndSaved .container .row.page-data").innerHTML="",r.forEach((e,r)=>{(e.area.toLowerCase().includes(n)||e.name.toLowerCase().includes(n))&&(t=!0,_(o[r]))}),t||(document.querySelector(".competitionsAndSaved .container .row.page-data").innerHTML="No data available")}))})}))})}function _(e){const[n,t,r,o]=e,i=document.createElement("div");i.className="col l3 m6 s12",i.innerHTML=`<div class="card">\n                    <div class="card-image">\n                        <img src="${t}" alt="Area Flag">\n                    </div>\n                    <div class="card-content">\n                        <p>${r}</p>\n                    </div>\n                    <div class="card-action right-align">\n                        <a href="#saved?${o}&${n}">See Details</a>\n                    </div>\n                </div>`,document.querySelector(".competitionsAndSaved .container .row.page-data").appendChild(i)}function q(e,n){const t=document.querySelector(".tooltipped");let r="";S(e,n).then(o=>{o?r="Delete":(r="Deleted",t.classList.add("disabled")),t.setAttribute("data-tooltip",r),t.setAttribute("data-type",e),t.setAttribute("data-id",n)})}function E(){document.querySelector(".tooltipped").addEventListener("click",(function(){let e=this.attributes[2].value,n=parseInt(this.attributes[4].value),t=this.attributes[3].value;var r,o;"Deleted"!==e?($(".tooltipped").tooltip("close"),(r=t,o=n,new Promise(e=>{w.then(n=>{if("match"!==r&&"competition"!==r)return;const t=n.transaction(r,"readwrite");t.objectStore(r).delete(o),e(t.complete)})})).then(()=>{this.classList.add("disabled"),this.setAttribute("data-tooltip","Deleted"),setTimeout(()=>{$(".tooltipped").tooltip("open"),setTimeout(()=>{$(".tooltipped").tooltip("close")},3e3)},200)})):(this.setAttribute("data-tooltip","Already Deleted"),$(".tooltipped").tooltip("open"))}))}function C(){L=!1;try{k.abort()}catch(e){}}function D(){return new Promise(e=>{fetch("./components/nav.html").then(P).then(n=>{document.querySelector(".navigation").innerHTML=n,$(".dropdown-trigger").dropdown(),$(".tabs").tabs();let t=document.querySelector(".sidenav");M.Sidenav.init(t),document.querySelectorAll(".selectNav li").forEach(e=>{e.addEventListener("click",(function(){this.className.includes("active")||N(this.dataset.link),$(".sidenav").sidenav("close")}))}),e(""),window.addEventListener("resize",(function(){$(".sidenav").sidenav("close")})),document.querySelectorAll(".pwa-nav").forEach(e=>{e.addEventListener("click",(function(){window.location.href=this.hash}))})}).catch(n=>{console.error(n),e("")})})}function N(e){document.querySelectorAll(".selectNav li.active").forEach(e=>{e.classList.remove("active")}),document.querySelectorAll(`.selectNav li[data-link=${e}]`).forEach(e=>{e.classList.add("active")}),document.querySelectorAll(".changeAble-icon").forEach(n=>{n.innerHTML=H[e]}),document.querySelectorAll(".changeAble-text").forEach(n=>{n.innerHTML=I[e]})}const j={"X-Auth-Token":"9acaf4710891457ea9104fa7c96cbd1c"},H={home:"tv",competitions:"leaderboard",saved:"save"},I={home:"Latest Matches",competitions:"Competitions",saved:"Saved Pages"};function z(e){return{headers:j,signal:e}}function P(e){return new Promise(n=>{n(e.text())})}function B(e){return new Promise(n=>{n(e.json())})}function O(e){return e=(e=(e=new Date(e)).toString()).split(" ")[4].slice(0,5)}function F(e){e.innerHTML='<div class="ball-loader-wrapper">\n    <div class="ball-loader">\n        <div></div>\n    </div>\n</div>'}function K(e){try{let n=e.querySelector(".ball-loader-wrapper");n&&n.remove()}catch(e){}}function U(e,n,t=null){const r=document.querySelector(".save-btn .tooltipped");let o="";S(e,n).then(n=>{n?(o="Already Saved",r.classList.add("disabled")):(o="Save",r.classList.remove("disabled")),r.setAttribute("data-tooltip",o),r.setAttribute("data-type",e),r.setAttribute("data-index",t),$(".tooltipped").tooltip("close")})}function W(e){document.querySelector(".save-btn .tooltipped").addEventListener("click",(function(){let n=this.attributes[2].value,t=parseInt(this.attributes[4].value),r=this.attributes[3].value;if("Already Saved"!==n&&"Saved"!==n){$(".tooltipped").tooltip("close");let n=t+1?e[t]:e;(o=r,i=n,new Promise(e=>{w.then(n=>{if("match"!==o&&"competition"!==o)return;i.saved_time=new Date,i.type=o;const t=n.transaction(o,"readwrite");t.objectStore(o).put(i),e(t.complete)})})).then(()=>{this.classList.add("disabled"),this.setAttribute("data-tooltip","Saved"),setTimeout(()=>{$(".tooltipped").tooltip("open"),setTimeout(()=>{$(".tooltipped").tooltip("close")},1e3)},200)})}else this.setAttribute("data-tooltip","Already Saved"),$(".tooltipped").tooltip("open");var o,i}))}function R(e=""){let n=window.location.href.split("#")[1]||"";if(F(document.querySelector(".page-content")),f(),""===n||"home"===n)g();else if(n.startsWith("competitions")){!function(e=""){G=!0;let n=new AbortController,{signal:t}=n;e?fetch("./components/competition-item.html",z(t)).then(P).then(n=>{document.querySelector(".page-content").innerHTML=n,function(e,n){if(G){fetch("https://api.football-data.org/v2/competitions/"+e,z(n)).then(B).then(n=>{ee(n),U("competition",e),W(n)})}}(e,t),$(".materialboxed").materialbox(),$(".collapsible").collapsible(),$(".tooltipped").tooltip()}):fetch("./components/competitionsAndSaved.html",z(t)).then(P).then(e=>{document.querySelector(".page-content").innerHTML=e,function(e){if(G){const n="https://api.football-data.org/v2/competitions?plan=TIER_ONE";F(document.querySelector(".competitionsAndSaved .container .row.page-data")),fetch(n,z(e)).then(B).then(e=>{let n=[];var t,r;K(document.querySelector(".competitionsAndSaved .container .row.page-data")),e.competitions.forEach(e=>{n.push({area:e.area.name,name:e.name}),Y(e)}),t=n,r=e.competitions,document.querySelectorAll(".competitionsAndSaved input.validate").forEach(e=>{e.addEventListener("keyup",(function(e){const n=e.target.value.toLowerCase();let o=!1;document.querySelector(".competitionsAndSaved .container .row.page-data").innerHTML="",t.forEach((e,t)=>{(e.area.toLowerCase().includes(n)||e.name.toLowerCase().includes(n))&&(o=!0,Y(r[t]))}),o||(document.querySelector(".competitionsAndSaved .container .row.page-data").innerHTML="No data available")}))})})}}(t)})}(n.split("?")[1]||"")}else if(n.startsWith("saved")){let e,t,r=n.split("?")[1];r&&(r=r.split("&"),[e,t]=[r[0],r[1]]),A(e,t)}else!function(e){window.location.href=e===e.toLowerCase()?"#home":"#"+e.toLowerCase()}(n);return n=n.split("?")[0]||n,N(n||"home"),n}const V={brazil:"https://upload.wikimedia.org/wikipedia/en/0/05/Flag_of_Brazil.svg",england:"https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg",europe:"https://ak.picdn.net/shutterstock/videos/823771/thumb/1.jpg",france:"https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg",germany:"https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg",italy:"https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg",netherlands:"https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg",portugal:"https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg",spain:"https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg",world:"https://upload.wikimedia.org/wikipedia/commons/2/24/The_world_flag_2006.svg"},Z=["january","february","march","april","may","june","july","august","september","october","november","december"];let G=!1;function J(e){const n=e.split("-");return{d:n[2],m:Z[parseInt(n[1])-1],y:n[0]}}let X=new AbortController,{signal:Q}=X;function Y(e){if(G){const n=e.area.name,t=V[n.toLowerCase()],r=document.createElement("div");r.className="col l3 m6 s12",r.innerHTML=`<div class="card">\n                    <div class="card-image">\n                        <img src="${t}" alt="${n} Flag">\n                    </div>\n                    <div class="card-content">\n                        <p>${e.name} - ${n}</p>\n                    </div>\n                    <div class="card-action right-align">\n                        <a href="#competitions?${e.id}">See Details</a>\n                    </div>\n                </div>`,document.querySelector(".competitionsAndSaved .container .row.page-data").appendChild(r)}}function ee(e){const{area:{name:n},name:t,code:r,currentSeason:{id:o},seasons:i}=e;K(document.querySelector(".competition")),document.querySelectorAll(".competition .flag").forEach(e=>{e.style.backgroundImage=`url("${V[n.toLowerCase()]}")`}),document.querySelector(".competitionName").innerHTML=`${t} (${r})`,document.querySelector(".competitionArea").innerHTML=n,i.forEach(e=>{const{d:n,m:t,y:r}=J(e.startDate),{d:i,m:a,y:c}=J(e.endDate),l=document.createElement("li");l.innerHTML=`<div class="collapsible-header"><i class="material-icons">whatshot</i>${t} ${r} ${e.id===o?"(current season)":""}\n        </div>\n        <div class="collapsible-body">\n            <ul>\n                <li>Start Date : ${n} ${t} ${r} </li>\n                <li>End Date : ${i} ${a} ${c} </li>\n                <li>Winner : ${null===e.winner?" - ":e.winner.name}</li>\n            </ul>\n        </div>`,document.querySelector(".competition ul.collapsible").appendChild(l)})}function ne(){G=!1;try{X.abort()}catch(e){}}function te(){"serviceWorker"in navigator?navigator.serviceWorker.register("./sw.js",{scope:"footballApp/build/"}).then(e=>{let n;console.log(`sw terdaftar di ${e.scope} dengan info ${e}`),e.installing&&(n=e.installing),e.waiting&&(n=e.waiting),e.active&&(n=e.active),n&&n.addEventListener("statechange",n=>{var t;"activated"===n.target.state&&(t=e,"PushManager"in window&&t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:a("BOaUpWREgpthUkhyM5wZuyDGmPkdqfUufOZjvOKsx2pdncEZK-gV1J9kv8XPqFGh9rhDbwHEk4dfBLBQz4yeyZk")}).then(e=>{console.log("Berhasil melakukan subscribe dengan p256dh key: ",btoa(String.fromCharCode.apply(null,new Uint8Array(e.getKey("p256dh"))))),console.log("Berhasil melakukan subscribe dengan auth key:",btoa(String.fromCharCode.apply(null,new Uint8Array(e.getKey("auth"))))),console.log("berhasil terhubung dengan endpoint "+e.endpoint)}).catch(e=>{console.error("Tidak dapat melakukan subscribe ",e.message)}))})}).catch(e=>console.error(e)):console.error("service worker not available")}document.addEventListener("DOMContentLoaded",(function(){te(),D().then(()=>{R()})})),window.onpopstate=e=>{try{$(".tooltipped").tooltip("close")}catch(e){}!function(e){const n={home:v,competitions:ne,saved:C};for(const t in n)e.includes(t)||n[t]()}(R(e))}}]);