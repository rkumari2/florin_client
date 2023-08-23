(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { change_page ,left_input,right_input} = require("./navigation")
const {changeTarget} = require("./suggestions")

window.addEventListener("resize", () => width = window.innerWidth)

// HOME PAGE
if(window.location.href.includes("index.html")){
    document.getElementById("c_right").addEventListener("click", () => right_input())
    document.getElementById("c_left").addEventListener("click", () => left_input())
    document.querySelector(".loginBtn").addEventListener("click",() => change_page("login"))
}



// SUGGESTIONS PAGE
if(window.location.href.includes("suggestions.html")){
    document.querySelectorAll(".card").forEach(card => card.addEventListener("click", ()=> changeTarget(card)))
}
},{"./navigation":2,"./suggestions":3}],2:[function(require,module,exports){
function change_page(page){
    location.href = `${page}.html`;
}

function updateClasses(curr,next){
    curr.classList.remove("current-slide")
    next.classList.add("current-slide")
}

function left_input(){
    const imgWrapper = document.getElementById("img-wrapper");
    const slides = Array.from(imgWrapper.children);
    const currentSlide = imgWrapper.querySelector(".current-slide")
    const currentSlideIndex = slides.indexOf(currentSlide)
    var width = window.innerWidth;

    let nextSlide = currentSlide.previousElementSibling;

    if(currentSlideIndex == 0){
        nextSlide = slides[3]
        imgWrapper.style.transform = `translateX(${-width*3}px)`
        
    }else{
        imgWrapper.style.transform = `translateX(${-width*(currentSlideIndex-1)}px)`
    }
    currentSlide.classList.remove("current-slide")
    nextSlide.classList.add("current-slide")
}

function right_input(){
    const imgWrapper = document.getElementById("img-wrapper");
    const slides = Array.from(imgWrapper.children);
    const currentSlide = imgWrapper.querySelector(".current-slide")
    const currentSlideIndex = slides.indexOf(currentSlide)
    var width = window.innerWidth;

    let nextSlide = currentSlide.nextElementSibling;

    if(currentSlideIndex+1 === slides.length){
        nextSlide = slides[0]
        imgWrapper.style.transform = `translateX(-${width*0}px)`
    }else{
        imgWrapper.style.transform = `translateX(-${width*(currentSlideIndex+1)}px)`
    }

    updateClasses(currentSlide,nextSlide)
}

module.exports = {change_page,left_input,right_input}
},{}],3:[function(require,module,exports){
function changeTarget(card){
    const oldCard = document.querySelector(".target");
    oldCard.classList.remove("target")
    card.classList.add("target")
}

module.exports = {changeTarget}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvaW5kZXguanMiLCJhc3NldHMvbmF2aWdhdGlvbi5qcyIsImFzc2V0cy9zdWdnZXN0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgeyBjaGFuZ2VfcGFnZSAsbGVmdF9pbnB1dCxyaWdodF9pbnB1dH0gPSByZXF1aXJlKFwiLi9uYXZpZ2F0aW9uXCIpXHJcbmNvbnN0IHtjaGFuZ2VUYXJnZXR9ID0gcmVxdWlyZShcIi4vc3VnZ2VzdGlvbnNcIilcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGgpXHJcblxyXG4vLyBIT01FIFBBR0VcclxuaWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJpbmRleC5odG1sXCIpKXtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY19yaWdodFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gcmlnaHRfaW5wdXQoKSlcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY19sZWZ0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBsZWZ0X2lucHV0KCkpXHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvZ2luQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCgpID0+IGNoYW5nZV9wYWdlKFwibG9naW5cIikpXHJcbn1cclxuXHJcblxyXG5cclxuLy8gU1VHR0VTVElPTlMgUEFHRVxyXG5pZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcInN1Z2dlc3Rpb25zLmh0bWxcIikpe1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpLmZvckVhY2goY2FyZCA9PiBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKT0+IGNoYW5nZVRhcmdldChjYXJkKSkpXHJcbn0iLCJmdW5jdGlvbiBjaGFuZ2VfcGFnZShwYWdlKXtcclxuICAgIGxvY2F0aW9uLmhyZWYgPSBgJHtwYWdlfS5odG1sYDtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ2xhc3NlcyhjdXJyLG5leHQpe1xyXG4gICAgY3Vyci5jbGFzc0xpc3QucmVtb3ZlKFwiY3VycmVudC1zbGlkZVwiKVxyXG4gICAgbmV4dC5jbGFzc0xpc3QuYWRkKFwiY3VycmVudC1zbGlkZVwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiBsZWZ0X2lucHV0KCl7XHJcbiAgICBjb25zdCBpbWdXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbWctd3JhcHBlclwiKTtcclxuICAgIGNvbnN0IHNsaWRlcyA9IEFycmF5LmZyb20oaW1nV3JhcHBlci5jaGlsZHJlbik7XHJcbiAgICBjb25zdCBjdXJyZW50U2xpZGUgPSBpbWdXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudC1zbGlkZVwiKVxyXG4gICAgY29uc3QgY3VycmVudFNsaWRlSW5kZXggPSBzbGlkZXMuaW5kZXhPZihjdXJyZW50U2xpZGUpXHJcbiAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHJcbiAgICBsZXQgbmV4dFNsaWRlID0gY3VycmVudFNsaWRlLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgaWYoY3VycmVudFNsaWRlSW5kZXggPT0gMCl7XHJcbiAgICAgICAgbmV4dFNsaWRlID0gc2xpZGVzWzNdXHJcbiAgICAgICAgaW1nV3JhcHBlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgkey13aWR0aCozfXB4KWBcclxuICAgICAgICBcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGltZ1dyYXBwZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHstd2lkdGgqKGN1cnJlbnRTbGlkZUluZGV4LTEpfXB4KWBcclxuICAgIH1cclxuICAgIGN1cnJlbnRTbGlkZS5jbGFzc0xpc3QucmVtb3ZlKFwiY3VycmVudC1zbGlkZVwiKVxyXG4gICAgbmV4dFNsaWRlLmNsYXNzTGlzdC5hZGQoXCJjdXJyZW50LXNsaWRlXCIpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJpZ2h0X2lucHV0KCl7XHJcbiAgICBjb25zdCBpbWdXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbWctd3JhcHBlclwiKTtcclxuICAgIGNvbnN0IHNsaWRlcyA9IEFycmF5LmZyb20oaW1nV3JhcHBlci5jaGlsZHJlbik7XHJcbiAgICBjb25zdCBjdXJyZW50U2xpZGUgPSBpbWdXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudC1zbGlkZVwiKVxyXG4gICAgY29uc3QgY3VycmVudFNsaWRlSW5kZXggPSBzbGlkZXMuaW5kZXhPZihjdXJyZW50U2xpZGUpXHJcbiAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHJcbiAgICBsZXQgbmV4dFNsaWRlID0gY3VycmVudFNsaWRlLm5leHRFbGVtZW50U2libGluZztcclxuXHJcbiAgICBpZihjdXJyZW50U2xpZGVJbmRleCsxID09PSBzbGlkZXMubGVuZ3RoKXtcclxuICAgICAgICBuZXh0U2xpZGUgPSBzbGlkZXNbMF1cclxuICAgICAgICBpbWdXcmFwcGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKC0ke3dpZHRoKjB9cHgpYFxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgaW1nV3JhcHBlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgtJHt3aWR0aCooY3VycmVudFNsaWRlSW5kZXgrMSl9cHgpYFxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNsYXNzZXMoY3VycmVudFNsaWRlLG5leHRTbGlkZSlcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7Y2hhbmdlX3BhZ2UsbGVmdF9pbnB1dCxyaWdodF9pbnB1dH0iLCJmdW5jdGlvbiBjaGFuZ2VUYXJnZXQoY2FyZCl7XHJcbiAgICBjb25zdCBvbGRDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXJnZXRcIik7XHJcbiAgICBvbGRDYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJ0YXJnZXRcIilcclxuICAgIGNhcmQuY2xhc3NMaXN0LmFkZChcInRhcmdldFwiKVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtjaGFuZ2VUYXJnZXR9Il19
