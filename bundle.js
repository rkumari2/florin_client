(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { change_page ,left_input,right_input} = require("./navigation")
const {changeTarget,loadAllSuggestions,postSuggestion} = require("./suggestions")

window.addEventListener("resize", () => width = window.innerWidth)

// HOME PAGE
if(window.location.href.includes("index.html")){
    document.getElementById("c_right").addEventListener("click", () => right_input())
    document.getElementById("c_left").addEventListener("click", () => left_input())
    document.querySelector(".loginBtn").addEventListener("click",() => change_page("login"))
}



// SUGGESTIONS PAGE
if(window.location.href.includes("suggestions.html")){
    document.querySelectorAll(".card").forEach(card => card.addEventListener("click", async () => changeTarget(card)))
    window.addEventListener("load", async ()=> loadAllSuggestions())
    document.getElementById("post").addEventListener("submit",postSuggestion)
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

function createPost(id,title,category,desc){
    const parent = document.createElement("div")
    parent.classList.add("post")
    parent.setAttribute("id",`post${id}`)

    const titleContainer = document.createElement("div")
    titleContainer.classList.add("titleContainer")

    const titleEl = document.createElement("h5")
    titleEl.textContent = title
    titleContainer.appendChild(titleEl)

    const categoryEl = document.createElement("h6")
    categoryEl.textContent = "-"+category
    titleContainer.appendChild(categoryEl) 

    parent.appendChild(titleContainer)

    const content = document.createElement("p")
    content.textContent = desc
    parent.appendChild(content)

    return parent;
}

function resolveCategory(cat){
    if(cat === "publicservices"){
        return 1;
    }else if(cat === "recycling"){
        return 2;
    }else if(cat === "landscape"){
        return 3;
    }else{
        return 4;
    }
}

// GET ALL SUGGESTIONS
async function loadAllSuggestions(){
    const suggestionsContainer = document.querySelector(".suggestions")

    const response = await fetch("http://localhost:3000/suggestions")
    const posts = await response.json()
    posts.forEach(post => {
        const newPost = createPost(post.id,post.title,post.category_name,post.content)
        suggestionsContainer.appendChild(newPost)
    })
}

async function postSuggestion(e){
    e.preventDefault()

    const titleEntry = e.target.title.value;
    const category = e.target.category.value;
    const descEntry = e.target.content.value;

    console.log(category)

    const posts = document.getElementsByClassName("post")

    const catIdx = resolveCategory(category);

    const options = {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            category_name:category,
            title:titleEntry,
            content:descEntry,
            user_id:1
        })
    }
    const response = await fetch(`http://localhost:3000/categories/${catIdx}/suggestions`,options)
    if(posts.length > 0){
        while(posts.length > 0){
            posts[0].parentNode.removeChild(posts[0])
        }
    }
    loadAllSuggestions()
}

module.exports = {changeTarget,loadAllSuggestions, postSuggestion}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvaW5kZXguanMiLCJhc3NldHMvbmF2aWdhdGlvbi5qcyIsImFzc2V0cy9zdWdnZXN0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IHsgY2hhbmdlX3BhZ2UgLGxlZnRfaW5wdXQscmlnaHRfaW5wdXR9ID0gcmVxdWlyZShcIi4vbmF2aWdhdGlvblwiKVxyXG5jb25zdCB7Y2hhbmdlVGFyZ2V0LGxvYWRBbGxTdWdnZXN0aW9ucyxwb3N0U3VnZ2VzdGlvbn0gPSByZXF1aXJlKFwiLi9zdWdnZXN0aW9uc1wiKVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4gd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aClcclxuXHJcbi8vIEhPTUUgUEFHRVxyXG5pZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcImluZGV4Lmh0bWxcIikpe1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjX3JpZ2h0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiByaWdodF9pbnB1dCgpKVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjX2xlZnRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGxlZnRfaW5wdXQoKSlcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9naW5CdG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsKCkgPT4gY2hhbmdlX3BhZ2UoXCJsb2dpblwiKSlcclxufVxyXG5cclxuXHJcblxyXG4vLyBTVUdHRVNUSU9OUyBQQUdFXHJcbmlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwic3VnZ2VzdGlvbnMuaHRtbFwiKSl7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIikuZm9yRWFjaChjYXJkID0+IGNhcmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IGNoYW5nZVRhcmdldChjYXJkKSkpXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgYXN5bmMgKCk9PiBsb2FkQWxsU3VnZ2VzdGlvbnMoKSlcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zdFwiKS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIscG9zdFN1Z2dlc3Rpb24pXHJcbn0iLCJmdW5jdGlvbiBjaGFuZ2VfcGFnZShwYWdlKXtcclxuICAgIGxvY2F0aW9uLmhyZWYgPSBgJHtwYWdlfS5odG1sYDtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ2xhc3NlcyhjdXJyLG5leHQpe1xyXG4gICAgY3Vyci5jbGFzc0xpc3QucmVtb3ZlKFwiY3VycmVudC1zbGlkZVwiKVxyXG4gICAgbmV4dC5jbGFzc0xpc3QuYWRkKFwiY3VycmVudC1zbGlkZVwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiBsZWZ0X2lucHV0KCl7XHJcbiAgICBjb25zdCBpbWdXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbWctd3JhcHBlclwiKTtcclxuICAgIGNvbnN0IHNsaWRlcyA9IEFycmF5LmZyb20oaW1nV3JhcHBlci5jaGlsZHJlbik7XHJcbiAgICBjb25zdCBjdXJyZW50U2xpZGUgPSBpbWdXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudC1zbGlkZVwiKVxyXG4gICAgY29uc3QgY3VycmVudFNsaWRlSW5kZXggPSBzbGlkZXMuaW5kZXhPZihjdXJyZW50U2xpZGUpXHJcbiAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHJcbiAgICBsZXQgbmV4dFNsaWRlID0gY3VycmVudFNsaWRlLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgaWYoY3VycmVudFNsaWRlSW5kZXggPT0gMCl7XHJcbiAgICAgICAgbmV4dFNsaWRlID0gc2xpZGVzWzNdXHJcbiAgICAgICAgaW1nV3JhcHBlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgkey13aWR0aCozfXB4KWBcclxuICAgICAgICBcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGltZ1dyYXBwZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHstd2lkdGgqKGN1cnJlbnRTbGlkZUluZGV4LTEpfXB4KWBcclxuICAgIH1cclxuICAgIGN1cnJlbnRTbGlkZS5jbGFzc0xpc3QucmVtb3ZlKFwiY3VycmVudC1zbGlkZVwiKVxyXG4gICAgbmV4dFNsaWRlLmNsYXNzTGlzdC5hZGQoXCJjdXJyZW50LXNsaWRlXCIpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJpZ2h0X2lucHV0KCl7XHJcbiAgICBjb25zdCBpbWdXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbWctd3JhcHBlclwiKTtcclxuICAgIGNvbnN0IHNsaWRlcyA9IEFycmF5LmZyb20oaW1nV3JhcHBlci5jaGlsZHJlbik7XHJcbiAgICBjb25zdCBjdXJyZW50U2xpZGUgPSBpbWdXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudC1zbGlkZVwiKVxyXG4gICAgY29uc3QgY3VycmVudFNsaWRlSW5kZXggPSBzbGlkZXMuaW5kZXhPZihjdXJyZW50U2xpZGUpXHJcbiAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHJcbiAgICBsZXQgbmV4dFNsaWRlID0gY3VycmVudFNsaWRlLm5leHRFbGVtZW50U2libGluZztcclxuXHJcbiAgICBpZihjdXJyZW50U2xpZGVJbmRleCsxID09PSBzbGlkZXMubGVuZ3RoKXtcclxuICAgICAgICBuZXh0U2xpZGUgPSBzbGlkZXNbMF1cclxuICAgICAgICBpbWdXcmFwcGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKC0ke3dpZHRoKjB9cHgpYFxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgaW1nV3JhcHBlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgtJHt3aWR0aCooY3VycmVudFNsaWRlSW5kZXgrMSl9cHgpYFxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNsYXNzZXMoY3VycmVudFNsaWRlLG5leHRTbGlkZSlcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7Y2hhbmdlX3BhZ2UsbGVmdF9pbnB1dCxyaWdodF9pbnB1dH0iLCJmdW5jdGlvbiBjaGFuZ2VUYXJnZXQoY2FyZCl7XHJcbiAgICBjb25zdCBvbGRDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXJnZXRcIik7XHJcbiAgICBvbGRDYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJ0YXJnZXRcIilcclxuICAgIGNhcmQuY2xhc3NMaXN0LmFkZChcInRhcmdldFwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVQb3N0KGlkLHRpdGxlLGNhdGVnb3J5LGRlc2Mpe1xyXG4gICAgY29uc3QgcGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgcGFyZW50LmNsYXNzTGlzdC5hZGQoXCJwb3N0XCIpXHJcbiAgICBwYXJlbnQuc2V0QXR0cmlidXRlKFwiaWRcIixgcG9zdCR7aWR9YClcclxuXHJcbiAgICBjb25zdCB0aXRsZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuICAgIHRpdGxlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJ0aXRsZUNvbnRhaW5lclwiKVxyXG5cclxuICAgIGNvbnN0IHRpdGxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDVcIilcclxuICAgIHRpdGxlRWwudGV4dENvbnRlbnQgPSB0aXRsZVxyXG4gICAgdGl0bGVDb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGVFbClcclxuXHJcbiAgICBjb25zdCBjYXRlZ29yeUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg2XCIpXHJcbiAgICBjYXRlZ29yeUVsLnRleHRDb250ZW50ID0gXCItXCIrY2F0ZWdvcnlcclxuICAgIHRpdGxlQ29udGFpbmVyLmFwcGVuZENoaWxkKGNhdGVnb3J5RWwpIFxyXG5cclxuICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aXRsZUNvbnRhaW5lcilcclxuXHJcbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIilcclxuICAgIGNvbnRlbnQudGV4dENvbnRlbnQgPSBkZXNjXHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY29udGVudClcclxuXHJcbiAgICByZXR1cm4gcGFyZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNvbHZlQ2F0ZWdvcnkoY2F0KXtcclxuICAgIGlmKGNhdCA9PT0gXCJwdWJsaWNzZXJ2aWNlc1wiKXtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH1lbHNlIGlmKGNhdCA9PT0gXCJyZWN5Y2xpbmdcIil7XHJcbiAgICAgICAgcmV0dXJuIDI7XHJcbiAgICB9ZWxzZSBpZihjYXQgPT09IFwibGFuZHNjYXBlXCIpe1xyXG4gICAgICAgIHJldHVybiAzO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgcmV0dXJuIDQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIEdFVCBBTEwgU1VHR0VTVElPTlNcclxuYXN5bmMgZnVuY3Rpb24gbG9hZEFsbFN1Z2dlc3Rpb25zKCl7XHJcbiAgICBjb25zdCBzdWdnZXN0aW9uc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VnZ2VzdGlvbnNcIilcclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL3N1Z2dlc3Rpb25zXCIpXHJcbiAgICBjb25zdCBwb3N0cyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgcG9zdHMuZm9yRWFjaChwb3N0ID0+IHtcclxuICAgICAgICBjb25zdCBuZXdQb3N0ID0gY3JlYXRlUG9zdChwb3N0LmlkLHBvc3QudGl0bGUscG9zdC5jYXRlZ29yeV9uYW1lLHBvc3QuY29udGVudClcclxuICAgICAgICBzdWdnZXN0aW9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChuZXdQb3N0KVxyXG4gICAgfSlcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gcG9zdFN1Z2dlc3Rpb24oZSl7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICBjb25zdCB0aXRsZUVudHJ5ID0gZS50YXJnZXQudGl0bGUudmFsdWU7XHJcbiAgICBjb25zdCBjYXRlZ29yeSA9IGUudGFyZ2V0LmNhdGVnb3J5LnZhbHVlO1xyXG4gICAgY29uc3QgZGVzY0VudHJ5ID0gZS50YXJnZXQuY29udGVudC52YWx1ZTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhjYXRlZ29yeSlcclxuXHJcbiAgICBjb25zdCBwb3N0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwb3N0XCIpXHJcblxyXG4gICAgY29uc3QgY2F0SWR4ID0gcmVzb2x2ZUNhdGVnb3J5KGNhdGVnb3J5KTtcclxuXHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgIG1ldGhvZDpcIlBPU1RcIixcclxuICAgICAgICBoZWFkZXJzOntcIkNvbnRlbnQtVHlwZVwiOlwiYXBwbGljYXRpb24vanNvblwifSxcclxuICAgICAgICBib2R5OkpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgY2F0ZWdvcnlfbmFtZTpjYXRlZ29yeSxcclxuICAgICAgICAgICAgdGl0bGU6dGl0bGVFbnRyeSxcclxuICAgICAgICAgICAgY29udGVudDpkZXNjRW50cnksXHJcbiAgICAgICAgICAgIHVzZXJfaWQ6MVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjMwMDAvY2F0ZWdvcmllcy8ke2NhdElkeH0vc3VnZ2VzdGlvbnNgLG9wdGlvbnMpXHJcbiAgICBpZihwb3N0cy5sZW5ndGggPiAwKXtcclxuICAgICAgICB3aGlsZShwb3N0cy5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgcG9zdHNbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwb3N0c1swXSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBsb2FkQWxsU3VnZ2VzdGlvbnMoKVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtjaGFuZ2VUYXJnZXQsbG9hZEFsbFN1Z2dlc3Rpb25zLCBwb3N0U3VnZ2VzdGlvbn0iXX0=
