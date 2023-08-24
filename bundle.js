(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {left_input,right_input} = require("./navigation")
const {checkLoggedIn} = require("./userLoggedIn")
const {changeTarget,findBySubString,loadAllSuggestions,postSuggestion,loadPostsFromCategory,destroyPosts} = require("./suggestions")

window.addEventListener("DOMContentLoaded", async () => checkLoggedIn())

// HOME PAGE
if(window.location.href.includes("index.html") || !(location.href.includes("html"))){
    document.getElementById("c_right").addEventListener("click", () => right_input())
    document.getElementById("c_left").addEventListener("click", () => left_input())
    document.querySelector(".loginBtn").addEventListener("click",() => change_page("login"))
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvaW5kZXguanMiLCJhc3NldHMvbmF2aWdhdGlvbi5qcyIsImFzc2V0cy9zdWdnZXN0aW9ucy5qcyIsImFzc2V0cy91c2VyTG9nZ2VkSW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCB7bGVmdF9pbnB1dCxyaWdodF9pbnB1dH0gPSByZXF1aXJlKFwiLi9uYXZpZ2F0aW9uXCIpXHJcbmNvbnN0IHtjaGVja0xvZ2dlZElufSA9IHJlcXVpcmUoXCIuL3VzZXJMb2dnZWRJblwiKVxyXG5jb25zdCB7Y2hhbmdlVGFyZ2V0LGZpbmRCeVN1YlN0cmluZyxsb2FkQWxsU3VnZ2VzdGlvbnMscG9zdFN1Z2dlc3Rpb24sbG9hZFBvc3RzRnJvbUNhdGVnb3J5LGRlc3Ryb3lQb3N0c30gPSByZXF1aXJlKFwiLi9zdWdnZXN0aW9uc1wiKVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGFzeW5jICgpID0+IGNoZWNrTG9nZ2VkSW4oKSlcclxuXHJcbi8vIEhPTUUgUEFHRVxyXG5pZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcImluZGV4Lmh0bWxcIikgfHwgIShsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiaHRtbFwiKSkpe1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjX3JpZ2h0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiByaWdodF9pbnB1dCgpKVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjX2xlZnRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGxlZnRfaW5wdXQoKSlcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9naW5CdG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsKCkgPT4gY2hhbmdlX3BhZ2UoXCJsb2dpblwiKSlcclxufVxyXG5cclxuXHJcblxyXG4vLyBTVUdHRVNUSU9OUyBQQUdFXHJcbmlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwic3VnZ2VzdGlvbnMuaHRtbFwiKSl7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIikuZm9yRWFjaChjYXJkID0+IGNhcmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcclxuICAgICAgICBkZXN0cm95UG9zdHMoKVxyXG4gICAgICAgIGNoYW5nZVRhcmdldChjYXJkKTtcclxuICAgICAgICBsb2FkUG9zdHNGcm9tQ2F0ZWdvcnkoKTtcclxuICAgIH0pKVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2gtZm9ybVwiKS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsZmluZEJ5U3ViU3RyaW5nKVxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGFzeW5jICgpPT4gbG9hZEFsbFN1Z2dlc3Rpb25zKCkpXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvc3RcIikuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLHBvc3RTdWdnZXN0aW9uKVxyXG59IiwiZnVuY3Rpb24gdXBkYXRlQ2xhc3NlcyhjdXJyLG5leHQpe1xyXG4gICAgY3Vyci5jbGFzc0xpc3QucmVtb3ZlKFwiY3VycmVudC1zbGlkZVwiKVxyXG4gICAgbmV4dC5jbGFzc0xpc3QuYWRkKFwiY3VycmVudC1zbGlkZVwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiBsZWZ0X2lucHV0KCl7XHJcbiAgICBjb25zdCBpbWdXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbWctd3JhcHBlclwiKTtcclxuICAgIGNvbnN0IHNsaWRlcyA9IEFycmF5LmZyb20oaW1nV3JhcHBlci5jaGlsZHJlbik7XHJcbiAgICBjb25zdCBjdXJyZW50U2xpZGUgPSBpbWdXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudC1zbGlkZVwiKVxyXG4gICAgY29uc3QgY3VycmVudFNsaWRlSW5kZXggPSBzbGlkZXMuaW5kZXhPZihjdXJyZW50U2xpZGUpXHJcbiAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHJcbiAgICBsZXQgbmV4dFNsaWRlID0gY3VycmVudFNsaWRlLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgaWYoY3VycmVudFNsaWRlSW5kZXggPT0gMCl7XHJcbiAgICAgICAgbmV4dFNsaWRlID0gc2xpZGVzWzNdXHJcbiAgICAgICAgaW1nV3JhcHBlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgkey13aWR0aCozfXB4KWBcclxuICAgICAgICBcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGltZ1dyYXBwZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHstd2lkdGgqKGN1cnJlbnRTbGlkZUluZGV4LTEpfXB4KWBcclxuICAgIH1cclxuICAgIGN1cnJlbnRTbGlkZS5jbGFzc0xpc3QucmVtb3ZlKFwiY3VycmVudC1zbGlkZVwiKVxyXG4gICAgbmV4dFNsaWRlLmNsYXNzTGlzdC5hZGQoXCJjdXJyZW50LXNsaWRlXCIpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJpZ2h0X2lucHV0KCl7XHJcbiAgICBjb25zdCBpbWdXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbWctd3JhcHBlclwiKTtcclxuICAgIGNvbnN0IHNsaWRlcyA9IEFycmF5LmZyb20oaW1nV3JhcHBlci5jaGlsZHJlbik7XHJcbiAgICBjb25zdCBjdXJyZW50U2xpZGUgPSBpbWdXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudC1zbGlkZVwiKVxyXG4gICAgY29uc3QgY3VycmVudFNsaWRlSW5kZXggPSBzbGlkZXMuaW5kZXhPZihjdXJyZW50U2xpZGUpXHJcbiAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHJcbiAgICBsZXQgbmV4dFNsaWRlID0gY3VycmVudFNsaWRlLm5leHRFbGVtZW50U2libGluZztcclxuXHJcbiAgICBpZihjdXJyZW50U2xpZGVJbmRleCsxID09PSBzbGlkZXMubGVuZ3RoKXtcclxuICAgICAgICBuZXh0U2xpZGUgPSBzbGlkZXNbMF1cclxuICAgICAgICBpbWdXcmFwcGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKC0ke3dpZHRoKjB9cHgpYFxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgaW1nV3JhcHBlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgtJHt3aWR0aCooY3VycmVudFNsaWRlSW5kZXgrMSl9cHgpYFxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNsYXNzZXMoY3VycmVudFNsaWRlLG5leHRTbGlkZSlcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7bGVmdF9pbnB1dCxyaWdodF9pbnB1dH0iLCJmdW5jdGlvbiBjaGFuZ2VUYXJnZXQoY2FyZCl7XHJcbiAgICBjb25zdCBvbGRDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXJnZXRcIik7XHJcblxyXG4gICAgaWYob2xkQ2FyZCA9PT0gbnVsbCl7XHJcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKFwidGFyZ2V0XCIpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBvbGRDYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJ0YXJnZXRcIilcclxuICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoXCJ0YXJnZXRcIilcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUG9zdChpZCx0aXRsZSxjYXRlZ29yeSxkZXNjKXtcclxuICAgIGNvbnN0IHBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuICAgIHBhcmVudC5jbGFzc0xpc3QuYWRkKFwicG9zdFwiKVxyXG4gICAgcGFyZW50LnNldEF0dHJpYnV0ZShcImlkXCIsYHBvc3Qke2lkfWApXHJcblxyXG4gICAgY29uc3QgdGl0bGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcbiAgICB0aXRsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwidGl0bGVDb250YWluZXJcIilcclxuXHJcbiAgICBjb25zdCB0aXRsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg1XCIpXHJcbiAgICB0aXRsZUVsLnRleHRDb250ZW50ID0gdGl0bGVcclxuICAgIHRpdGxlQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlRWwpXHJcblxyXG4gICAgY29uc3QgY2F0ZWdvcnlFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNlwiKVxyXG4gICAgY2F0ZWdvcnlFbC50ZXh0Q29udGVudCA9IFwiLVwiK2NhdGVnb3J5XHJcbiAgICB0aXRsZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjYXRlZ29yeUVsKSBcclxuXHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGl0bGVDb250YWluZXIpXHJcblxyXG4gICAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpXHJcbiAgICBjb250ZW50LnRleHRDb250ZW50ID0gZGVzY1xyXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKGNvbnRlbnQpXHJcblxyXG4gICAgcmV0dXJuIHBhcmVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzb2x2ZUNhdGVnb3J5KGNhdCl7XHJcbiAgICBpZihjYXQgPT09IFwicHVibGljc2VydmljZXNcIil7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9ZWxzZSBpZihjYXQgPT09IFwicmVjeWNsaW5nXCIpe1xyXG4gICAgICAgIHJldHVybiAyO1xyXG4gICAgfWVsc2UgaWYoY2F0ID09PSBcImxhbmRzY2FwZVwiKXtcclxuICAgICAgICByZXR1cm4gMztcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHJldHVybiA0O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZXN0cm95UG9zdHMoKXtcclxuICAgIGNvbnN0IHBvc3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBvc3RcIilcclxuICAgIGlmKHBvc3RzLmxlbmd0aCA+IDApe1xyXG4gICAgICAgIHdoaWxlKHBvc3RzLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBwb3N0c1swXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBvc3RzWzBdKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZmluZEJ5U3ViU3RyaW5nKGUpe1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZGVzdHJveVBvc3RzKCk7XHJcbiAgICBjb25zdCBzdWdnQ29udCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VnZ2VzdGlvbnNcIilcclxuICAgIGNvbnN0IHN1YlN0cmluZyA9IGUudGFyZ2V0LnNlYXJjaC52YWx1ZTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvc3VnZ2VzdGlvbnNcIilcclxuICAgIGNvbnN0IHBvc3RzID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcblxyXG4gICAgY29uc3QgcXVlcmllZFBvc3RzID0gW107XHJcbiAgICBwb3N0cy5mb3JFYWNoKHBvc3QgPT4ge1xyXG4gICAgICAgIGlmKHBvc3QudGl0bGUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzdWJTdHJpbmcudG9Mb3dlckNhc2UoKSkpe1xyXG4gICAgICAgICAgICBxdWVyaWVkUG9zdHMucHVzaChwb3N0KVxyXG4gICAgICAgIH1lbHNlIGlmKHBvc3QuY2F0ZWdvcnlfbmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHN1YlN0cmluZy50b0xvd2VyQ2FzZSgpKSl7XHJcbiAgICAgICAgICAgIHF1ZXJpZWRQb3N0cy5wdXNoKHBvc3QpXHJcbiAgICAgICAgfWVsc2UgaWYocG9zdC5jb250ZW50LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc3ViU3RyaW5nLnRvTG93ZXJDYXNlKCkpKXtcclxuICAgICAgICAgICAgcXVlcmllZFBvc3RzLnB1c2gocG9zdClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgcXVlcmllZFBvc3RzLmZvckVhY2gocG9zdCA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3UG9zdCA9IGNyZWF0ZVBvc3QocG9zdC5pZCxwb3N0LnRpdGxlLHBvc3QuY2F0ZWdvcnlfbmFtZSxwb3N0LmNvbnRlbnQpXHJcbiAgICAgICAgc3VnZ0NvbnQuYXBwZW5kQ2hpbGQobmV3UG9zdClcclxuICAgIH0pXHJcbn1cclxuXHJcblxyXG4vLyBHRVQgQUxMIFNVR0dFU1RJT05TXHJcbmFzeW5jIGZ1bmN0aW9uIGxvYWRBbGxTdWdnZXN0aW9ucygpe1xyXG4gICAgY29uc3Qgc3VnZ2VzdGlvbnNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN1Z2dlc3Rpb25zXCIpXHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL3N1Z2dlc3Rpb25zXCIpXHJcbiAgICAgICAgY29uc3QgcG9zdHMgPSBhd2FpdCByZXNwb25zZS5qc29uKClcclxuICAgICAgICBwb3N0cy5mb3JFYWNoKHBvc3QgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5ld1Bvc3QgPSBjcmVhdGVQb3N0KHBvc3QuaWQscG9zdC50aXRsZSxwb3N0LmNhdGVnb3J5X25hbWUscG9zdC5jb250ZW50KVxyXG4gICAgICAgIHN1Z2dlc3Rpb25zQ29udGFpbmVyLmFwcGVuZENoaWxkKG5ld1Bvc3QpXHJcbiAgICB9KVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSZW5kZXJpbmcgYmVmb3JlIGxvYWRlZCBjb250ZW50LlwiLCBlcnIubWVzc2FnZSlcclxuICAgIH1cclxuXHJcbiAgICBcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gbG9hZFBvc3RzRnJvbUNhdGVnb3J5KCl7XHJcbiAgICBcclxuICAgIGNvbnN0IHN1Z2dDb250ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdWdnZXN0aW9uc1wiKVxyXG4gICAgY29uc3QgdG9waWMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRhcmdldFwiKVxyXG4gICAgY29uc3QgcG9zdElkeCA9IHJlc29sdmVDYXRlZ29yeSh0b3BpYy5pZClcclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjMwMDAvY2F0ZWdvcmllcy8ke3Bvc3RJZHh9L3N1Z2dlc3Rpb25zYClcclxuICAgIGNvbnN0IHBvc3RzID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcblxyXG4gICAgcG9zdHMuZm9yRWFjaChwb3N0ID0+IHtcclxuICAgICAgICBjb25zdCBuZXdQb3N0ID0gY3JlYXRlUG9zdChwb3N0LmlkLHBvc3QudGl0bGUscG9zdC5jYXRlZ29yeV9uYW1lLHBvc3QuY29udGVudClcclxuICAgICAgICBzdWdnQ29udC5hcHBlbmRDaGlsZChuZXdQb3N0KVxyXG4gICAgfSlcclxuXHJcbiAgICBcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gcG9zdFN1Z2dlc3Rpb24oZSl7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICBjb25zdCB0aXRsZUVudHJ5ID0gZS50YXJnZXQudGl0bGUudmFsdWU7XHJcbiAgICBjb25zdCBjYXRlZ29yeSA9IGUudGFyZ2V0LmNhdGVnb3J5LnZhbHVlO1xyXG4gICAgY29uc3QgZGVzY0VudHJ5ID0gZS50YXJnZXQuY29udGVudC52YWx1ZTtcclxuXHJcbiAgICAvLyBjb25zdCBwb3N0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwb3N0XCIpXHJcblxyXG4gICAgY29uc3QgY2F0SWR4ID0gcmVzb2x2ZUNhdGVnb3J5KGNhdGVnb3J5KTtcclxuXHJcbiAgICBpZih0aXRsZUVudHJ5LnRyaW0oKS5sZW5ndGggPiAwICYmIGRlc2NFbnRyeS50cmltKCkubGVuZ3RoID4wKXtcclxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6XCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6e1wiQ29udGVudC1UeXBlXCI6XCJhcHBsaWNhdGlvbi9qc29uXCJ9LFxyXG4gICAgICAgICAgICBib2R5OkpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5X25hbWU6Y2F0ZWdvcnksXHJcbiAgICAgICAgICAgICAgICB0aXRsZTp0aXRsZUVudHJ5LFxyXG4gICAgICAgICAgICAgICAgY29udGVudDpkZXNjRW50cnksXHJcbiAgICAgICAgICAgICAgICB1c2VyX2lkOjFcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDozMDAwL2NhdGVnb3JpZXMvJHtjYXRJZHh9L3N1Z2dlc3Rpb25zYCxvcHRpb25zKVxyXG4gICAgICAgIGRlc3Ryb3lQb3N0cygpXHJcbiAgICAgICAgbG9hZEFsbFN1Z2dlc3Rpb25zKClcclxuICAgIH1cclxuICAgIGUudGFyZ2V0LnRpdGxlLnZhbHVlID0gXCJcIjtcclxuICAgIGUudGFyZ2V0LmNvbnRlbnQudmFsdWUgPSBcIlwiO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtjaGFuZ2VUYXJnZXQsZmluZEJ5U3ViU3RyaW5nLGxvYWRBbGxTdWdnZXN0aW9ucywgcG9zdFN1Z2dlc3Rpb24sbG9hZFBvc3RzRnJvbUNhdGVnb3J5LGRlc3Ryb3lQb3N0c30iLCJjb25zdCBjaGVja0xvZ2dlZEluID0gYXN5bmMgKCkgPT57XHJcbiAgICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIilcclxuICAgIGlmKHRva2VuLmxlbmd0aCA+IDApe1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvdXNlcnMvdG9rZW5zXCIpXHJcbiAgICAgICAgY29uc3QgcmVzcFRva2VuID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcbiAgICAgICAgbGV0IHVzZXIgPSBcIlwiO1xyXG5cclxuICAgICAgICBmb3IodCBpbiByZXNwVG9rZW4pe1xyXG4gICAgICAgICAgICBpZiAocmVzcFRva2VuW3RdLnRva2VuID09IHRva2VuKXtcclxuICAgICAgICAgICAgICAgIHVzZXIgPSBhd2FpdCBnZXRVc2VybmFtZShyZXNwVG9rZW5bdF0udXNlcl9pZClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBkaXNhYmxlTG9naW4odXNlcilcclxuICAgICAgICBjcmVhdGVTaWduT3V0KHVzZXIpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIk5vIG9uZSBpcyBsb2dnZWQgaW4uXCIpXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGNyZWF0ZVNpZ25PdXQgPSAodXNlcm5hbWUpID0+IHtcclxuICAgIGNvbnN0IHVzZXJuYW1lRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hdnVzZXJuYW1lXCIpXHJcbiAgICB1c2VybmFtZUVsLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIlxyXG4gICAgdXNlcm5hbWVFbC50ZXh0Q29udGVudCA9IGAke3VzZXJuYW1lfWBcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9nb3V0XCIpLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIlxyXG59XHJcblxyXG5jb25zdCBkaXNhYmxlTG9naW4gPSAodXNlcm5hbWUpID0+IHtcclxuICAgIGlmKHVzZXJuYW1lKXtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVnaXN0ZXJcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGdldFVzZXJuYW1lID0gYXN5bmMgKHVzZXJfaWQpID0+IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC91c2Vyc2ApXHJcbiAgICBjb25zdCB1c2VycyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgbGV0IHVzZXJuYW1lO1xyXG4gICAgZm9yKHUgaW4gdXNlcnMpe1xyXG4gICAgICAgIGlmKHVzZXJzW3VdLmlkID09PSB1c2VyX2lkKXtcclxuICAgICAgICAgICAgcmV0dXJuIHVzZXJzW3VdLnVzZXJuYW1lXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtjaGVja0xvZ2dlZElufSJdfQ==
