(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {left_input,right_input} = require("./navigation")
const {changeTarget,findBySubString,loadAllSuggestions,postSuggestion,loadPostsFromCategory,destroyPosts} = require("./suggestions")

// HOME PAGE
if(window.location.href.includes("index.html") || !(location.href.includes("html"))){
    document.getElementById("c_right").addEventListener("click", () => right_input())
    document.getElementById("c_left").addEventListener("click", () => left_input())
    // document.querySelector(".loginBtn").addEventListener("click",() => change_page("login"))
}



// SUGGESTIONS PAGE
if(window.location.href.includes("suggestions.html")){
    document.querySelectorAll(".card").forEach(card => card.addEventListener("click", async () => {
        destroyPosts()
        changeTarget(card);
        loadPostsFromCategory();
    }))
    document.getElementById("search-form").addEventListener("submit",findBySubString)
    window.addEventListener("DOMContentLoaded", async ()=> loadAllSuggestions())
    document.getElementById("post").addEventListener("submit",postSuggestion)
}
},{"./navigation":2,"./suggestions":3}],2:[function(require,module,exports){
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

module.exports = {left_input,right_input}
},{}],3:[function(require,module,exports){
function changeTarget(card){
    const oldCard = document.querySelector(".target");

    if(oldCard === null){
        card.classList.add("target")
    }else{
        oldCard.classList.remove("target")
        card.classList.add("target")
    }
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

function destroyPosts(){
    const posts = document.getElementsByClassName("post")
    if(posts.length > 0){
        while(posts.length > 0){
            posts[0].parentNode.removeChild(posts[0])
        }
    }
}

async function findBySubString(e){
    e.preventDefault();
    destroyPosts();
    const suggCont = document.querySelector(".suggestions")
    const subString = e.target.search.value;
    const response = await fetch("http://localhost:3000/suggestions")
    const posts = await response.json()

    const queriedPosts = [];
    posts.forEach(post => {
        if(post.title.toLowerCase().includes(subString.toLowerCase())){
            queriedPosts.push(post)
        }else if(post.category_name.toLowerCase().includes(subString.toLowerCase())){
            queriedPosts.push(post)
        }else if(post.content.toLowerCase().includes(subString.toLowerCase())){
            queriedPosts.push(post)
        }
    })
    queriedPosts.forEach(post => {
        const newPost = createPost(post.id,post.title,post.category_name,post.content)
        suggCont.appendChild(newPost)
    })
}


// GET ALL SUGGESTIONS
async function loadAllSuggestions(){
    const suggestionsContainer = document.querySelector(".suggestions")

    try {
        const response = await fetch("http://localhost:3000/suggestions")
        const posts = await response.json()
        posts.forEach(post => {
        const newPost = createPost(post.id,post.title,post.category_name,post.content)
        suggestionsContainer.appendChild(newPost)
    })
    } catch (err) {
        console.log("!!!!!",err.message)
    }

    
}

async function loadPostsFromCategory(){
    
    const suggCont = document.querySelector(".suggestions")
    const topic = document.querySelector(".target")
    const postIdx = resolveCategory(topic.id)

    const response = await fetch(`http://localhost:3000/categories/${postIdx}/suggestions`)
    const posts = await response.json()

    posts.forEach(post => {
        const newPost = createPost(post.id,post.title,post.category_name,post.content)
        suggCont.appendChild(newPost)
    })

    
}

async function postSuggestion(e){
    e.preventDefault()

    const titleEntry = e.target.title.value;
    const category = e.target.category.value;
    const descEntry = e.target.content.value;

    // const posts = document.getElementsByClassName("post")

    const catIdx = resolveCategory(category);

    if(titleEntry.trim().length > 0 && descEntry.trim().length >0){
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
        destroyPosts()
        loadAllSuggestions()
    }
    e.target.title.value = "";
    e.target.content.value = "";
}

module.exports = {changeTarget,findBySubString,loadAllSuggestions, postSuggestion,loadPostsFromCategory,destroyPosts}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvaW5kZXguanMiLCJhc3NldHMvbmF2aWdhdGlvbi5qcyIsImFzc2V0cy9zdWdnZXN0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCB7bGVmdF9pbnB1dCxyaWdodF9pbnB1dH0gPSByZXF1aXJlKFwiLi9uYXZpZ2F0aW9uXCIpXHJcbmNvbnN0IHtjaGFuZ2VUYXJnZXQsZmluZEJ5U3ViU3RyaW5nLGxvYWRBbGxTdWdnZXN0aW9ucyxwb3N0U3VnZ2VzdGlvbixsb2FkUG9zdHNGcm9tQ2F0ZWdvcnksZGVzdHJveVBvc3RzfSA9IHJlcXVpcmUoXCIuL3N1Z2dlc3Rpb25zXCIpXHJcblxyXG4vLyBIT01FIFBBR0VcclxuaWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJpbmRleC5odG1sXCIpIHx8ICEobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcImh0bWxcIikpKXtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY19yaWdodFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gcmlnaHRfaW5wdXQoKSlcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY19sZWZ0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBsZWZ0X2lucHV0KCkpXHJcbiAgICAvLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvZ2luQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCgpID0+IGNoYW5nZV9wYWdlKFwibG9naW5cIikpXHJcbn1cclxuXHJcblxyXG5cclxuLy8gU1VHR0VTVElPTlMgUEFHRVxyXG5pZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcInN1Z2dlc3Rpb25zLmh0bWxcIikpe1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpLmZvckVhY2goY2FyZCA9PiBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgZGVzdHJveVBvc3RzKClcclxuICAgICAgICBjaGFuZ2VUYXJnZXQoY2FyZCk7XHJcbiAgICAgICAgbG9hZFBvc3RzRnJvbUNhdGVnb3J5KCk7XHJcbiAgICB9KSlcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoLWZvcm1cIikuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLGZpbmRCeVN1YlN0cmluZylcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBhc3luYyAoKT0+IGxvYWRBbGxTdWdnZXN0aW9ucygpKVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3N0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIixwb3N0U3VnZ2VzdGlvbilcclxufSIsImZ1bmN0aW9uIHVwZGF0ZUNsYXNzZXMoY3VycixuZXh0KXtcclxuICAgIGN1cnIuY2xhc3NMaXN0LnJlbW92ZShcImN1cnJlbnQtc2xpZGVcIilcclxuICAgIG5leHQuY2xhc3NMaXN0LmFkZChcImN1cnJlbnQtc2xpZGVcIilcclxufVxyXG5cclxuZnVuY3Rpb24gbGVmdF9pbnB1dCgpe1xyXG4gICAgY29uc3QgaW1nV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW1nLXdyYXBwZXJcIik7XHJcbiAgICBjb25zdCBzbGlkZXMgPSBBcnJheS5mcm9tKGltZ1dyYXBwZXIuY2hpbGRyZW4pO1xyXG4gICAgY29uc3QgY3VycmVudFNsaWRlID0gaW1nV3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnQtc2xpZGVcIilcclxuICAgIGNvbnN0IGN1cnJlbnRTbGlkZUluZGV4ID0gc2xpZGVzLmluZGV4T2YoY3VycmVudFNsaWRlKVxyXG4gICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblxyXG4gICAgbGV0IG5leHRTbGlkZSA9IGN1cnJlbnRTbGlkZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG5cclxuICAgIGlmKGN1cnJlbnRTbGlkZUluZGV4ID09IDApe1xyXG4gICAgICAgIG5leHRTbGlkZSA9IHNsaWRlc1szXVxyXG4gICAgICAgIGltZ1dyYXBwZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHstd2lkdGgqM31weClgXHJcbiAgICAgICAgXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBpbWdXcmFwcGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7LXdpZHRoKihjdXJyZW50U2xpZGVJbmRleC0xKX1weClgXHJcbiAgICB9XHJcbiAgICBjdXJyZW50U2xpZGUuY2xhc3NMaXN0LnJlbW92ZShcImN1cnJlbnQtc2xpZGVcIilcclxuICAgIG5leHRTbGlkZS5jbGFzc0xpc3QuYWRkKFwiY3VycmVudC1zbGlkZVwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiByaWdodF9pbnB1dCgpe1xyXG4gICAgY29uc3QgaW1nV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW1nLXdyYXBwZXJcIik7XHJcbiAgICBjb25zdCBzbGlkZXMgPSBBcnJheS5mcm9tKGltZ1dyYXBwZXIuY2hpbGRyZW4pO1xyXG4gICAgY29uc3QgY3VycmVudFNsaWRlID0gaW1nV3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnQtc2xpZGVcIilcclxuICAgIGNvbnN0IGN1cnJlbnRTbGlkZUluZGV4ID0gc2xpZGVzLmluZGV4T2YoY3VycmVudFNsaWRlKVxyXG4gICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblxyXG4gICAgbGV0IG5leHRTbGlkZSA9IGN1cnJlbnRTbGlkZS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgaWYoY3VycmVudFNsaWRlSW5kZXgrMSA9PT0gc2xpZGVzLmxlbmd0aCl7XHJcbiAgICAgICAgbmV4dFNsaWRlID0gc2xpZGVzWzBdXHJcbiAgICAgICAgaW1nV3JhcHBlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgtJHt3aWR0aCowfXB4KWBcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGltZ1dyYXBwZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoLSR7d2lkdGgqKGN1cnJlbnRTbGlkZUluZGV4KzEpfXB4KWBcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDbGFzc2VzKGN1cnJlbnRTbGlkZSxuZXh0U2xpZGUpXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2xlZnRfaW5wdXQscmlnaHRfaW5wdXR9IiwiZnVuY3Rpb24gY2hhbmdlVGFyZ2V0KGNhcmQpe1xyXG4gICAgY29uc3Qgb2xkQ2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFyZ2V0XCIpO1xyXG5cclxuICAgIGlmKG9sZENhcmQgPT09IG51bGwpe1xyXG4gICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZChcInRhcmdldFwiKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgb2xkQ2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwidGFyZ2V0XCIpXHJcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKFwidGFyZ2V0XCIpXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBvc3QoaWQsdGl0bGUsY2F0ZWdvcnksZGVzYyl7XHJcbiAgICBjb25zdCBwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcbiAgICBwYXJlbnQuY2xhc3NMaXN0LmFkZChcInBvc3RcIilcclxuICAgIHBhcmVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLGBwb3N0JHtpZH1gKVxyXG5cclxuICAgIGNvbnN0IHRpdGxlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgdGl0bGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInRpdGxlQ29udGFpbmVyXCIpXHJcblxyXG4gICAgY29uc3QgdGl0bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNVwiKVxyXG4gICAgdGl0bGVFbC50ZXh0Q29udGVudCA9IHRpdGxlXHJcbiAgICB0aXRsZUNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZUVsKVxyXG5cclxuICAgIGNvbnN0IGNhdGVnb3J5RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDZcIilcclxuICAgIGNhdGVnb3J5RWwudGV4dENvbnRlbnQgPSBcIi1cIitjYXRlZ29yeVxyXG4gICAgdGl0bGVDb250YWluZXIuYXBwZW5kQ2hpbGQoY2F0ZWdvcnlFbCkgXHJcblxyXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRpdGxlQ29udGFpbmVyKVxyXG5cclxuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKVxyXG4gICAgY29udGVudC50ZXh0Q29udGVudCA9IGRlc2NcclxuICAgIHBhcmVudC5hcHBlbmRDaGlsZChjb250ZW50KVxyXG5cclxuICAgIHJldHVybiBwYXJlbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc29sdmVDYXRlZ29yeShjYXQpe1xyXG4gICAgaWYoY2F0ID09PSBcInB1YmxpY3NlcnZpY2VzXCIpe1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgfWVsc2UgaWYoY2F0ID09PSBcInJlY3ljbGluZ1wiKXtcclxuICAgICAgICByZXR1cm4gMjtcclxuICAgIH1lbHNlIGlmKGNhdCA9PT0gXCJsYW5kc2NhcGVcIil7XHJcbiAgICAgICAgcmV0dXJuIDM7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICByZXR1cm4gNDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVzdHJveVBvc3RzKCl7XHJcbiAgICBjb25zdCBwb3N0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwb3N0XCIpXHJcbiAgICBpZihwb3N0cy5sZW5ndGggPiAwKXtcclxuICAgICAgICB3aGlsZShwb3N0cy5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgcG9zdHNbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwb3N0c1swXSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbmRCeVN1YlN0cmluZyhlKXtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGRlc3Ryb3lQb3N0cygpO1xyXG4gICAgY29uc3Qgc3VnZ0NvbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN1Z2dlc3Rpb25zXCIpXHJcbiAgICBjb25zdCBzdWJTdHJpbmcgPSBlLnRhcmdldC5zZWFyY2gudmFsdWU7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL3N1Z2dlc3Rpb25zXCIpXHJcbiAgICBjb25zdCBwb3N0cyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG5cclxuICAgIGNvbnN0IHF1ZXJpZWRQb3N0cyA9IFtdO1xyXG4gICAgcG9zdHMuZm9yRWFjaChwb3N0ID0+IHtcclxuICAgICAgICBpZihwb3N0LnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc3ViU3RyaW5nLnRvTG93ZXJDYXNlKCkpKXtcclxuICAgICAgICAgICAgcXVlcmllZFBvc3RzLnB1c2gocG9zdClcclxuICAgICAgICB9ZWxzZSBpZihwb3N0LmNhdGVnb3J5X25hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzdWJTdHJpbmcudG9Mb3dlckNhc2UoKSkpe1xyXG4gICAgICAgICAgICBxdWVyaWVkUG9zdHMucHVzaChwb3N0KVxyXG4gICAgICAgIH1lbHNlIGlmKHBvc3QuY29udGVudC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHN1YlN0cmluZy50b0xvd2VyQ2FzZSgpKSl7XHJcbiAgICAgICAgICAgIHF1ZXJpZWRQb3N0cy5wdXNoKHBvc3QpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHF1ZXJpZWRQb3N0cy5mb3JFYWNoKHBvc3QgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5ld1Bvc3QgPSBjcmVhdGVQb3N0KHBvc3QuaWQscG9zdC50aXRsZSxwb3N0LmNhdGVnb3J5X25hbWUscG9zdC5jb250ZW50KVxyXG4gICAgICAgIHN1Z2dDb250LmFwcGVuZENoaWxkKG5ld1Bvc3QpXHJcbiAgICB9KVxyXG59XHJcblxyXG5cclxuLy8gR0VUIEFMTCBTVUdHRVNUSU9OU1xyXG5hc3luYyBmdW5jdGlvbiBsb2FkQWxsU3VnZ2VzdGlvbnMoKXtcclxuICAgIGNvbnN0IHN1Z2dlc3Rpb25zQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdWdnZXN0aW9uc1wiKVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9zdWdnZXN0aW9uc1wiKVxyXG4gICAgICAgIGNvbnN0IHBvc3RzID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcbiAgICAgICAgcG9zdHMuZm9yRWFjaChwb3N0ID0+IHtcclxuICAgICAgICBjb25zdCBuZXdQb3N0ID0gY3JlYXRlUG9zdChwb3N0LmlkLHBvc3QudGl0bGUscG9zdC5jYXRlZ29yeV9uYW1lLHBvc3QuY29udGVudClcclxuICAgICAgICBzdWdnZXN0aW9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChuZXdQb3N0KVxyXG4gICAgfSlcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiISEhISFcIixlcnIubWVzc2FnZSlcclxuICAgIH1cclxuXHJcbiAgICBcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gbG9hZFBvc3RzRnJvbUNhdGVnb3J5KCl7XHJcbiAgICBcclxuICAgIGNvbnN0IHN1Z2dDb250ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdWdnZXN0aW9uc1wiKVxyXG4gICAgY29uc3QgdG9waWMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRhcmdldFwiKVxyXG4gICAgY29uc3QgcG9zdElkeCA9IHJlc29sdmVDYXRlZ29yeSh0b3BpYy5pZClcclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjMwMDAvY2F0ZWdvcmllcy8ke3Bvc3RJZHh9L3N1Z2dlc3Rpb25zYClcclxuICAgIGNvbnN0IHBvc3RzID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcblxyXG4gICAgcG9zdHMuZm9yRWFjaChwb3N0ID0+IHtcclxuICAgICAgICBjb25zdCBuZXdQb3N0ID0gY3JlYXRlUG9zdChwb3N0LmlkLHBvc3QudGl0bGUscG9zdC5jYXRlZ29yeV9uYW1lLHBvc3QuY29udGVudClcclxuICAgICAgICBzdWdnQ29udC5hcHBlbmRDaGlsZChuZXdQb3N0KVxyXG4gICAgfSlcclxuXHJcbiAgICBcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gcG9zdFN1Z2dlc3Rpb24oZSl7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICBjb25zdCB0aXRsZUVudHJ5ID0gZS50YXJnZXQudGl0bGUudmFsdWU7XHJcbiAgICBjb25zdCBjYXRlZ29yeSA9IGUudGFyZ2V0LmNhdGVnb3J5LnZhbHVlO1xyXG4gICAgY29uc3QgZGVzY0VudHJ5ID0gZS50YXJnZXQuY29udGVudC52YWx1ZTtcclxuXHJcbiAgICAvLyBjb25zdCBwb3N0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwb3N0XCIpXHJcblxyXG4gICAgY29uc3QgY2F0SWR4ID0gcmVzb2x2ZUNhdGVnb3J5KGNhdGVnb3J5KTtcclxuXHJcbiAgICBpZih0aXRsZUVudHJ5LnRyaW0oKS5sZW5ndGggPiAwICYmIGRlc2NFbnRyeS50cmltKCkubGVuZ3RoID4wKXtcclxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6XCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6e1wiQ29udGVudC1UeXBlXCI6XCJhcHBsaWNhdGlvbi9qc29uXCJ9LFxyXG4gICAgICAgICAgICBib2R5OkpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5X25hbWU6Y2F0ZWdvcnksXHJcbiAgICAgICAgICAgICAgICB0aXRsZTp0aXRsZUVudHJ5LFxyXG4gICAgICAgICAgICAgICAgY29udGVudDpkZXNjRW50cnksXHJcbiAgICAgICAgICAgICAgICB1c2VyX2lkOjFcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDozMDAwL2NhdGVnb3JpZXMvJHtjYXRJZHh9L3N1Z2dlc3Rpb25zYCxvcHRpb25zKVxyXG4gICAgICAgIGRlc3Ryb3lQb3N0cygpXHJcbiAgICAgICAgbG9hZEFsbFN1Z2dlc3Rpb25zKClcclxuICAgIH1cclxuICAgIGUudGFyZ2V0LnRpdGxlLnZhbHVlID0gXCJcIjtcclxuICAgIGUudGFyZ2V0LmNvbnRlbnQudmFsdWUgPSBcIlwiO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtjaGFuZ2VUYXJnZXQsZmluZEJ5U3ViU3RyaW5nLGxvYWRBbGxTdWdnZXN0aW9ucywgcG9zdFN1Z2dlc3Rpb24sbG9hZFBvc3RzRnJvbUNhdGVnb3J5LGRlc3Ryb3lQb3N0c30iXX0=
