(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {left_input,right_input} = require("./navigation")
const {checkLoggedIn} = require("./userLoggedIn")
const {changeTarget,findBySubString,loadAllSuggestions,postSuggestion,loadPostsFromCategory,destroyPosts} = require("./suggestions")

// HOME PAGE
if(window.location.href.includes("index.html") || !(location.href.includes("html"))){
    document.getElementById("c_right").addEventListener("click", () => right_input())
    document.getElementById("c_left").addEventListener("click", () => left_input())
    window.addEventListener("DOMContentLoaded", async () => checkLoggedIn())
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
},{"./navigation":2,"./suggestions":3,"./userLoggedIn":4}],2:[function(require,module,exports){
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
        console.log("Rendering before loaded content.", err.message)
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
},{}],4:[function(require,module,exports){
const checkLoggedIn = async () =>{
    const token = localStorage.getItem("token")
    if(token.length > 0){
        const response = await fetch("http://localhost:3000/users/tokens")
        const respToken = await response.json()
        let user = "";

        for(t in respToken){
            if (respToken[t].token == token){
                user = await getUsername(respToken[t].user_id)
            }
        }
        disableLogin(user)
        createSignOut(user)
    }else{
        console.log("No one is logged in.")
    }
}

const createSignOut = (username) => {
    const usernameEl = document.getElementById("navusername")
    usernameEl.style.display = "flex"
    usernameEl.textContent = `${username}`
    document.getElementById("logout").style.display = "flex"
}

const disableLogin = (username) => {
    if(username){
        document.getElementById("login").style.display = "none"
        document.getElementById("register").style.display = "none"
    }
}

const getUsername = async (user_id) => {
    const response = await fetch(`http://localhost:3000/users`)
    const users = await response.json()
    let username;
    for(u in users){
        if(users[u].id === user_id){
            return users[u].username
        }
    }
}

module.exports = {checkLoggedIn}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvaW5kZXguanMiLCJhc3NldHMvbmF2aWdhdGlvbi5qcyIsImFzc2V0cy9zdWdnZXN0aW9ucy5qcyIsImFzc2V0cy91c2VyTG9nZ2VkSW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3Qge2xlZnRfaW5wdXQscmlnaHRfaW5wdXR9ID0gcmVxdWlyZShcIi4vbmF2aWdhdGlvblwiKVxyXG5jb25zdCB7Y2hlY2tMb2dnZWRJbn0gPSByZXF1aXJlKFwiLi91c2VyTG9nZ2VkSW5cIilcclxuY29uc3Qge2NoYW5nZVRhcmdldCxmaW5kQnlTdWJTdHJpbmcsbG9hZEFsbFN1Z2dlc3Rpb25zLHBvc3RTdWdnZXN0aW9uLGxvYWRQb3N0c0Zyb21DYXRlZ29yeSxkZXN0cm95UG9zdHN9ID0gcmVxdWlyZShcIi4vc3VnZ2VzdGlvbnNcIilcclxuXHJcbi8vIEhPTUUgUEFHRVxyXG5pZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcImluZGV4Lmh0bWxcIikgfHwgIShsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiaHRtbFwiKSkpe1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjX3JpZ2h0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiByaWdodF9pbnB1dCgpKVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjX2xlZnRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGxlZnRfaW5wdXQoKSlcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBhc3luYyAoKSA9PiBjaGVja0xvZ2dlZEluKCkpXHJcbiAgICAvLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvZ2luQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCgpID0+IGNoYW5nZV9wYWdlKFwibG9naW5cIikpXHJcbn1cclxuXHJcblxyXG5cclxuLy8gU1VHR0VTVElPTlMgUEFHRVxyXG5pZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcInN1Z2dlc3Rpb25zLmh0bWxcIikpe1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpLmZvckVhY2goY2FyZCA9PiBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgZGVzdHJveVBvc3RzKClcclxuICAgICAgICBjaGFuZ2VUYXJnZXQoY2FyZCk7XHJcbiAgICAgICAgbG9hZFBvc3RzRnJvbUNhdGVnb3J5KCk7XHJcbiAgICB9KSlcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoLWZvcm1cIikuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLGZpbmRCeVN1YlN0cmluZylcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBhc3luYyAoKT0+IGxvYWRBbGxTdWdnZXN0aW9ucygpKVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3N0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIixwb3N0U3VnZ2VzdGlvbilcclxufSIsImZ1bmN0aW9uIHVwZGF0ZUNsYXNzZXMoY3VycixuZXh0KXtcclxuICAgIGN1cnIuY2xhc3NMaXN0LnJlbW92ZShcImN1cnJlbnQtc2xpZGVcIilcclxuICAgIG5leHQuY2xhc3NMaXN0LmFkZChcImN1cnJlbnQtc2xpZGVcIilcclxufVxyXG5cclxuZnVuY3Rpb24gbGVmdF9pbnB1dCgpe1xyXG4gICAgY29uc3QgaW1nV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW1nLXdyYXBwZXJcIik7XHJcbiAgICBjb25zdCBzbGlkZXMgPSBBcnJheS5mcm9tKGltZ1dyYXBwZXIuY2hpbGRyZW4pO1xyXG4gICAgY29uc3QgY3VycmVudFNsaWRlID0gaW1nV3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnQtc2xpZGVcIilcclxuICAgIGNvbnN0IGN1cnJlbnRTbGlkZUluZGV4ID0gc2xpZGVzLmluZGV4T2YoY3VycmVudFNsaWRlKVxyXG4gICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblxyXG4gICAgbGV0IG5leHRTbGlkZSA9IGN1cnJlbnRTbGlkZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG5cclxuICAgIGlmKGN1cnJlbnRTbGlkZUluZGV4ID09IDApe1xyXG4gICAgICAgIG5leHRTbGlkZSA9IHNsaWRlc1szXVxyXG4gICAgICAgIGltZ1dyYXBwZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHstd2lkdGgqM31weClgXHJcbiAgICAgICAgXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBpbWdXcmFwcGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7LXdpZHRoKihjdXJyZW50U2xpZGVJbmRleC0xKX1weClgXHJcbiAgICB9XHJcbiAgICBjdXJyZW50U2xpZGUuY2xhc3NMaXN0LnJlbW92ZShcImN1cnJlbnQtc2xpZGVcIilcclxuICAgIG5leHRTbGlkZS5jbGFzc0xpc3QuYWRkKFwiY3VycmVudC1zbGlkZVwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiByaWdodF9pbnB1dCgpe1xyXG4gICAgY29uc3QgaW1nV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW1nLXdyYXBwZXJcIik7XHJcbiAgICBjb25zdCBzbGlkZXMgPSBBcnJheS5mcm9tKGltZ1dyYXBwZXIuY2hpbGRyZW4pO1xyXG4gICAgY29uc3QgY3VycmVudFNsaWRlID0gaW1nV3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnQtc2xpZGVcIilcclxuICAgIGNvbnN0IGN1cnJlbnRTbGlkZUluZGV4ID0gc2xpZGVzLmluZGV4T2YoY3VycmVudFNsaWRlKVxyXG4gICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblxyXG4gICAgbGV0IG5leHRTbGlkZSA9IGN1cnJlbnRTbGlkZS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgaWYoY3VycmVudFNsaWRlSW5kZXgrMSA9PT0gc2xpZGVzLmxlbmd0aCl7XHJcbiAgICAgICAgbmV4dFNsaWRlID0gc2xpZGVzWzBdXHJcbiAgICAgICAgaW1nV3JhcHBlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgtJHt3aWR0aCowfXB4KWBcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGltZ1dyYXBwZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoLSR7d2lkdGgqKGN1cnJlbnRTbGlkZUluZGV4KzEpfXB4KWBcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDbGFzc2VzKGN1cnJlbnRTbGlkZSxuZXh0U2xpZGUpXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2xlZnRfaW5wdXQscmlnaHRfaW5wdXR9IiwiZnVuY3Rpb24gY2hhbmdlVGFyZ2V0KGNhcmQpe1xyXG4gICAgY29uc3Qgb2xkQ2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFyZ2V0XCIpO1xyXG5cclxuICAgIGlmKG9sZENhcmQgPT09IG51bGwpe1xyXG4gICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZChcInRhcmdldFwiKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgb2xkQ2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwidGFyZ2V0XCIpXHJcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKFwidGFyZ2V0XCIpXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBvc3QoaWQsdGl0bGUsY2F0ZWdvcnksZGVzYyl7XHJcbiAgICBjb25zdCBwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcbiAgICBwYXJlbnQuY2xhc3NMaXN0LmFkZChcInBvc3RcIilcclxuICAgIHBhcmVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLGBwb3N0JHtpZH1gKVxyXG5cclxuICAgIGNvbnN0IHRpdGxlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgdGl0bGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInRpdGxlQ29udGFpbmVyXCIpXHJcblxyXG4gICAgY29uc3QgdGl0bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNVwiKVxyXG4gICAgdGl0bGVFbC50ZXh0Q29udGVudCA9IHRpdGxlXHJcbiAgICB0aXRsZUNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZUVsKVxyXG5cclxuICAgIGNvbnN0IGNhdGVnb3J5RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDZcIilcclxuICAgIGNhdGVnb3J5RWwudGV4dENvbnRlbnQgPSBcIi1cIitjYXRlZ29yeVxyXG4gICAgdGl0bGVDb250YWluZXIuYXBwZW5kQ2hpbGQoY2F0ZWdvcnlFbCkgXHJcblxyXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRpdGxlQ29udGFpbmVyKVxyXG5cclxuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKVxyXG4gICAgY29udGVudC50ZXh0Q29udGVudCA9IGRlc2NcclxuICAgIHBhcmVudC5hcHBlbmRDaGlsZChjb250ZW50KVxyXG5cclxuICAgIHJldHVybiBwYXJlbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc29sdmVDYXRlZ29yeShjYXQpe1xyXG4gICAgaWYoY2F0ID09PSBcInB1YmxpY3NlcnZpY2VzXCIpe1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgfWVsc2UgaWYoY2F0ID09PSBcInJlY3ljbGluZ1wiKXtcclxuICAgICAgICByZXR1cm4gMjtcclxuICAgIH1lbHNlIGlmKGNhdCA9PT0gXCJsYW5kc2NhcGVcIil7XHJcbiAgICAgICAgcmV0dXJuIDM7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICByZXR1cm4gNDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVzdHJveVBvc3RzKCl7XHJcbiAgICBjb25zdCBwb3N0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwb3N0XCIpXHJcbiAgICBpZihwb3N0cy5sZW5ndGggPiAwKXtcclxuICAgICAgICB3aGlsZShwb3N0cy5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgcG9zdHNbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwb3N0c1swXSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbmRCeVN1YlN0cmluZyhlKXtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGRlc3Ryb3lQb3N0cygpO1xyXG4gICAgY29uc3Qgc3VnZ0NvbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN1Z2dlc3Rpb25zXCIpXHJcbiAgICBjb25zdCBzdWJTdHJpbmcgPSBlLnRhcmdldC5zZWFyY2gudmFsdWU7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL3N1Z2dlc3Rpb25zXCIpXHJcbiAgICBjb25zdCBwb3N0cyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG5cclxuICAgIGNvbnN0IHF1ZXJpZWRQb3N0cyA9IFtdO1xyXG4gICAgcG9zdHMuZm9yRWFjaChwb3N0ID0+IHtcclxuICAgICAgICBpZihwb3N0LnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc3ViU3RyaW5nLnRvTG93ZXJDYXNlKCkpKXtcclxuICAgICAgICAgICAgcXVlcmllZFBvc3RzLnB1c2gocG9zdClcclxuICAgICAgICB9ZWxzZSBpZihwb3N0LmNhdGVnb3J5X25hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzdWJTdHJpbmcudG9Mb3dlckNhc2UoKSkpe1xyXG4gICAgICAgICAgICBxdWVyaWVkUG9zdHMucHVzaChwb3N0KVxyXG4gICAgICAgIH1lbHNlIGlmKHBvc3QuY29udGVudC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHN1YlN0cmluZy50b0xvd2VyQ2FzZSgpKSl7XHJcbiAgICAgICAgICAgIHF1ZXJpZWRQb3N0cy5wdXNoKHBvc3QpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHF1ZXJpZWRQb3N0cy5mb3JFYWNoKHBvc3QgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5ld1Bvc3QgPSBjcmVhdGVQb3N0KHBvc3QuaWQscG9zdC50aXRsZSxwb3N0LmNhdGVnb3J5X25hbWUscG9zdC5jb250ZW50KVxyXG4gICAgICAgIHN1Z2dDb250LmFwcGVuZENoaWxkKG5ld1Bvc3QpXHJcbiAgICB9KVxyXG59XHJcblxyXG5cclxuLy8gR0VUIEFMTCBTVUdHRVNUSU9OU1xyXG5hc3luYyBmdW5jdGlvbiBsb2FkQWxsU3VnZ2VzdGlvbnMoKXtcclxuICAgIGNvbnN0IHN1Z2dlc3Rpb25zQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdWdnZXN0aW9uc1wiKVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9zdWdnZXN0aW9uc1wiKVxyXG4gICAgICAgIGNvbnN0IHBvc3RzID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcbiAgICAgICAgcG9zdHMuZm9yRWFjaChwb3N0ID0+IHtcclxuICAgICAgICBjb25zdCBuZXdQb3N0ID0gY3JlYXRlUG9zdChwb3N0LmlkLHBvc3QudGl0bGUscG9zdC5jYXRlZ29yeV9uYW1lLHBvc3QuY29udGVudClcclxuICAgICAgICBzdWdnZXN0aW9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChuZXdQb3N0KVxyXG4gICAgfSlcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIGJlZm9yZSBsb2FkZWQgY29udGVudC5cIiwgZXJyLm1lc3NhZ2UpXHJcbiAgICB9XHJcblxyXG4gICAgXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGxvYWRQb3N0c0Zyb21DYXRlZ29yeSgpe1xyXG4gICAgXHJcbiAgICBjb25zdCBzdWdnQ29udCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VnZ2VzdGlvbnNcIilcclxuICAgIGNvbnN0IHRvcGljID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXJnZXRcIilcclxuICAgIGNvbnN0IHBvc3RJZHggPSByZXNvbHZlQ2F0ZWdvcnkodG9waWMuaWQpXHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDozMDAwL2NhdGVnb3JpZXMvJHtwb3N0SWR4fS9zdWdnZXN0aW9uc2ApXHJcbiAgICBjb25zdCBwb3N0cyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG5cclxuICAgIHBvc3RzLmZvckVhY2gocG9zdCA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3UG9zdCA9IGNyZWF0ZVBvc3QocG9zdC5pZCxwb3N0LnRpdGxlLHBvc3QuY2F0ZWdvcnlfbmFtZSxwb3N0LmNvbnRlbnQpXHJcbiAgICAgICAgc3VnZ0NvbnQuYXBwZW5kQ2hpbGQobmV3UG9zdClcclxuICAgIH0pXHJcblxyXG4gICAgXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHBvc3RTdWdnZXN0aW9uKGUpe1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgY29uc3QgdGl0bGVFbnRyeSA9IGUudGFyZ2V0LnRpdGxlLnZhbHVlO1xyXG4gICAgY29uc3QgY2F0ZWdvcnkgPSBlLnRhcmdldC5jYXRlZ29yeS52YWx1ZTtcclxuICAgIGNvbnN0IGRlc2NFbnRyeSA9IGUudGFyZ2V0LmNvbnRlbnQudmFsdWU7XHJcblxyXG4gICAgLy8gY29uc3QgcG9zdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicG9zdFwiKVxyXG5cclxuICAgIGNvbnN0IGNhdElkeCA9IHJlc29sdmVDYXRlZ29yeShjYXRlZ29yeSk7XHJcblxyXG4gICAgaWYodGl0bGVFbnRyeS50cmltKCkubGVuZ3RoID4gMCAmJiBkZXNjRW50cnkudHJpbSgpLmxlbmd0aCA+MCl7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOlwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOntcIkNvbnRlbnQtVHlwZVwiOlwiYXBwbGljYXRpb24vanNvblwifSxcclxuICAgICAgICAgICAgYm9keTpKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeV9uYW1lOmNhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6dGl0bGVFbnRyeSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ZGVzY0VudHJ5LFxyXG4gICAgICAgICAgICAgICAgdXNlcl9pZDoxXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9jYXRlZ29yaWVzLyR7Y2F0SWR4fS9zdWdnZXN0aW9uc2Asb3B0aW9ucylcclxuICAgICAgICBkZXN0cm95UG9zdHMoKVxyXG4gICAgICAgIGxvYWRBbGxTdWdnZXN0aW9ucygpXHJcbiAgICB9XHJcbiAgICBlLnRhcmdldC50aXRsZS52YWx1ZSA9IFwiXCI7XHJcbiAgICBlLnRhcmdldC5jb250ZW50LnZhbHVlID0gXCJcIjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7Y2hhbmdlVGFyZ2V0LGZpbmRCeVN1YlN0cmluZyxsb2FkQWxsU3VnZ2VzdGlvbnMsIHBvc3RTdWdnZXN0aW9uLGxvYWRQb3N0c0Zyb21DYXRlZ29yeSxkZXN0cm95UG9zdHN9IiwiY29uc3QgY2hlY2tMb2dnZWRJbiA9IGFzeW5jICgpID0+e1xyXG4gICAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpXHJcbiAgICBpZih0b2tlbi5sZW5ndGggPiAwKXtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL3VzZXJzL3Rva2Vuc1wiKVxyXG4gICAgICAgIGNvbnN0IHJlc3BUb2tlbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgICAgIGxldCB1c2VyID0gXCJcIjtcclxuXHJcbiAgICAgICAgZm9yKHQgaW4gcmVzcFRva2VuKXtcclxuICAgICAgICAgICAgaWYgKHJlc3BUb2tlblt0XS50b2tlbiA9PSB0b2tlbil7XHJcbiAgICAgICAgICAgICAgICB1c2VyID0gYXdhaXQgZ2V0VXNlcm5hbWUocmVzcFRva2VuW3RdLnVzZXJfaWQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZGlzYWJsZUxvZ2luKHVzZXIpXHJcbiAgICAgICAgY3JlYXRlU2lnbk91dCh1c2VyKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJObyBvbmUgaXMgbG9nZ2VkIGluLlwiKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBjcmVhdGVTaWduT3V0ID0gKHVzZXJuYW1lKSA9PiB7XHJcbiAgICBjb25zdCB1c2VybmFtZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYXZ1c2VybmFtZVwiKVxyXG4gICAgdXNlcm5hbWVFbC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCJcclxuICAgIHVzZXJuYW1lRWwudGV4dENvbnRlbnQgPSBgJHt1c2VybmFtZX1gXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ291dFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCJcclxufVxyXG5cclxuY29uc3QgZGlzYWJsZUxvZ2luID0gKHVzZXJuYW1lKSA9PiB7XHJcbiAgICBpZih1c2VybmFtZSl7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZ2lzdGVyXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBnZXRVc2VybmFtZSA9IGFzeW5jICh1c2VyX2lkKSA9PiB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjMwMDAvdXNlcnNgKVxyXG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCByZXNwb25zZS5qc29uKClcclxuICAgIGxldCB1c2VybmFtZTtcclxuICAgIGZvcih1IGluIHVzZXJzKXtcclxuICAgICAgICBpZih1c2Vyc1t1XS5pZCA9PT0gdXNlcl9pZCl7XHJcbiAgICAgICAgICAgIHJldHVybiB1c2Vyc1t1XS51c2VybmFtZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7Y2hlY2tMb2dnZWRJbn0iXX0=
