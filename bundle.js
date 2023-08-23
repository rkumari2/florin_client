(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { change_page ,left_input,right_input} = require("./navigation")

window.addEventListener("resize", () => width = window.innerWidth)

document.getElementById("c_right").addEventListener("click", () => right_input())
document.getElementById("c_left").addEventListener("click", () => left_input())
document.querySelector(".loginBtn").addEventListener("click",() => change_page("login"))

},{"./navigation":2}],2:[function(require,module,exports){
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvaW5kZXguanMiLCJhc3NldHMvbmF2aWdhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCB7IGNoYW5nZV9wYWdlICxsZWZ0X2lucHV0LHJpZ2h0X2lucHV0fSA9IHJlcXVpcmUoXCIuL25hdmlnYXRpb25cIilcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGgpXHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNfcmlnaHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHJpZ2h0X2lucHV0KCkpXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY19sZWZ0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBsZWZ0X2lucHV0KCkpXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9naW5CdG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsKCkgPT4gY2hhbmdlX3BhZ2UoXCJsb2dpblwiKSlcclxuIiwiZnVuY3Rpb24gY2hhbmdlX3BhZ2UocGFnZSl7XHJcbiAgICBsb2NhdGlvbi5ocmVmID0gYCR7cGFnZX0uaHRtbGA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUNsYXNzZXMoY3VycixuZXh0KXtcclxuICAgIGN1cnIuY2xhc3NMaXN0LnJlbW92ZShcImN1cnJlbnQtc2xpZGVcIilcclxuICAgIG5leHQuY2xhc3NMaXN0LmFkZChcImN1cnJlbnQtc2xpZGVcIilcclxufVxyXG5cclxuZnVuY3Rpb24gbGVmdF9pbnB1dCgpe1xyXG4gICAgY29uc3QgaW1nV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW1nLXdyYXBwZXJcIik7XHJcbiAgICBjb25zdCBzbGlkZXMgPSBBcnJheS5mcm9tKGltZ1dyYXBwZXIuY2hpbGRyZW4pO1xyXG4gICAgY29uc3QgY3VycmVudFNsaWRlID0gaW1nV3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnQtc2xpZGVcIilcclxuICAgIGNvbnN0IGN1cnJlbnRTbGlkZUluZGV4ID0gc2xpZGVzLmluZGV4T2YoY3VycmVudFNsaWRlKVxyXG4gICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblxyXG4gICAgbGV0IG5leHRTbGlkZSA9IGN1cnJlbnRTbGlkZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG5cclxuICAgIGlmKGN1cnJlbnRTbGlkZUluZGV4ID09IDApe1xyXG4gICAgICAgIG5leHRTbGlkZSA9IHNsaWRlc1szXVxyXG4gICAgICAgIGltZ1dyYXBwZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHstd2lkdGgqM31weClgXHJcbiAgICAgICAgXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBpbWdXcmFwcGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7LXdpZHRoKihjdXJyZW50U2xpZGVJbmRleC0xKX1weClgXHJcbiAgICB9XHJcbiAgICBjdXJyZW50U2xpZGUuY2xhc3NMaXN0LnJlbW92ZShcImN1cnJlbnQtc2xpZGVcIilcclxuICAgIG5leHRTbGlkZS5jbGFzc0xpc3QuYWRkKFwiY3VycmVudC1zbGlkZVwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiByaWdodF9pbnB1dCgpe1xyXG4gICAgY29uc3QgaW1nV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW1nLXdyYXBwZXJcIik7XHJcbiAgICBjb25zdCBzbGlkZXMgPSBBcnJheS5mcm9tKGltZ1dyYXBwZXIuY2hpbGRyZW4pO1xyXG4gICAgY29uc3QgY3VycmVudFNsaWRlID0gaW1nV3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnQtc2xpZGVcIilcclxuICAgIGNvbnN0IGN1cnJlbnRTbGlkZUluZGV4ID0gc2xpZGVzLmluZGV4T2YoY3VycmVudFNsaWRlKVxyXG4gICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblxyXG4gICAgbGV0IG5leHRTbGlkZSA9IGN1cnJlbnRTbGlkZS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgaWYoY3VycmVudFNsaWRlSW5kZXgrMSA9PT0gc2xpZGVzLmxlbmd0aCl7XHJcbiAgICAgICAgbmV4dFNsaWRlID0gc2xpZGVzWzBdXHJcbiAgICAgICAgaW1nV3JhcHBlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgtJHt3aWR0aCowfXB4KWBcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGltZ1dyYXBwZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoLSR7d2lkdGgqKGN1cnJlbnRTbGlkZUluZGV4KzEpfXB4KWBcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDbGFzc2VzKGN1cnJlbnRTbGlkZSxuZXh0U2xpZGUpXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2NoYW5nZV9wYWdlLGxlZnRfaW5wdXQscmlnaHRfaW5wdXR9Il19

