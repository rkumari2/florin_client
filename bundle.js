(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {left_input,right_input} = require("./navigation")
const {checkLoggedIn,logOut,checkIfGuest} = require("./userLoggedIn")
const {changeTarget,findBySubString,loadAllSuggestions,postSuggestion,loadPostsFromCategory,destroyPosts} = require("./suggestions")

window.addEventListener("DOMContentLoaded", async () => checkLoggedIn())

// Sign Out
document.getElementById("navlogout").addEventListener("click", async ()=> {
    await logOut()
    window.location.href = "./index.html"
})

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
    window.addEventListener("DOMContentLoaded", async ()=> {
        checkIfGuest()
        loadAllSuggestions()
    })
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
    if(cat === "Public Services" || cat === "publicservices"){
        return 1;
    }else if(cat === "Recycling" || cat === "recycling"){
        return 2;
    }else if(cat === "Landscape" || cat === "landscape"){
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

async function getUserId(){
    const sessionToken = sessionStorage.getItem("token")
    const response = await fetch("http://localhost:3000/users/tokens")
    const tokens = await response.json()

    for(t in tokens){
        if(tokens[t].token === sessionToken){
            return tokens[t].user_id;
        }
    }
}

async function postSuggestion(e){
    e.preventDefault()

    const titleEntry = e.target.title.value;
    const category = e.target.category.value;
    const descEntry = e.target.content.value;

    // const posts = document.getElementsByClassName("post")

    const catIdx = resolveCategory(category);

    const userId = await getUserId()

    if(titleEntry.trim().length > 0 && descEntry.trim().length >0){
        const options = {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                category_name:category,
                title:titleEntry,
                content:descEntry,
                user_id:userId
            })
        }
        const response = await fetch(`http://localhost:3000/categories/${catIdx}/suggestions`,options)
        const resp = response.json()
        destroyPosts()
        loadAllSuggestions()
    }
    e.target.title.value = "";
    e.target.content.value = "";
}

module.exports = {changeTarget,findBySubString,loadAllSuggestions, postSuggestion,loadPostsFromCategory,destroyPosts}
},{}],4:[function(require,module,exports){
const checkLoggedIn = async () =>{
    let token = ""
    try {
        token = sessionStorage.getItem("token")
    } catch (err) {
        console.log(err.message)
    }
    
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
    if(username){
        usernameEl.style.display = "flex"
        usernameEl.textContent = `${username}`
        document.getElementById("logout").style.display = "flex"
    }else{
        usernameEl.style.display = "none"
        usernameEl.textContent = ""
        document.getElementById("logout").style.display = "none"
    }
    
}

const disableLogin = (username) => {
    if(username){
        document.getElementById("login").style.display = "none"
        document.getElementById("register").style.display = "none"
    }else{
        document.getElementById("login").style.display = "flex"
        document.getElementById("register").style.display = "flex"
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

const getUser = async (user_id) => {
    const response = await fetch(`http://localhost:3000/users`)
    const users = await response.json()
    let username;
    for(u in users){
        if(users[u].id === user_id){
            return users[u]
        }
    }
}

const logOut = async () => {
    localToken = sessionStorage.getItem("token")

    let user;

    const response = await fetch("http://localhost:3000/users/tokens")
    const respToken = await response.json()
    for(t in respToken){
        if (respToken[t].token == localToken){
            user = await getUser(respToken[t].user_id)
        }
    }
    sessionStorage.removeItem("token");
    deleteCurrentUser(user)
    createSignOut()
    disableLogin()
}

const deleteCurrentUser = async (user) => {
    const options = {
        method:"DELETE",
        headers:{"Content-Type":"application/json"},
        body:null
    }
    const response = await fetch(`http://localhost:3000/users/tokens/${user.id}`,options)
}

const checkIfGuest = () => {
    if(!(sessionStorage.getItem("token"))){
        document.getElementById("post").style.display = "none";
    }
}

module.exports = {checkLoggedIn,logOut,checkIfGuest}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvaW5kZXguanMiLCJhc3NldHMvbmF2aWdhdGlvbi5qcyIsImFzc2V0cy9zdWdnZXN0aW9ucy5qcyIsImFzc2V0cy91c2VyTG9nZ2VkSW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCB7bGVmdF9pbnB1dCxyaWdodF9pbnB1dH0gPSByZXF1aXJlKFwiLi9uYXZpZ2F0aW9uXCIpXHJcbmNvbnN0IHtjaGVja0xvZ2dlZEluLGxvZ091dCxjaGVja0lmR3Vlc3R9ID0gcmVxdWlyZShcIi4vdXNlckxvZ2dlZEluXCIpXHJcbmNvbnN0IHtjaGFuZ2VUYXJnZXQsZmluZEJ5U3ViU3RyaW5nLGxvYWRBbGxTdWdnZXN0aW9ucyxwb3N0U3VnZ2VzdGlvbixsb2FkUG9zdHNGcm9tQ2F0ZWdvcnksZGVzdHJveVBvc3RzfSA9IHJlcXVpcmUoXCIuL3N1Z2dlc3Rpb25zXCIpXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgYXN5bmMgKCkgPT4gY2hlY2tMb2dnZWRJbigpKVxyXG5cclxuLy8gU2lnbiBPdXRcclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYXZsb2dvdXRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpPT4ge1xyXG4gICAgYXdhaXQgbG9nT3V0KClcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIuL2luZGV4Lmh0bWxcIlxyXG59KVxyXG5cclxuLy8gSE9NRSBQQUdFXHJcbmlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiaW5kZXguaHRtbFwiKSB8fCAhKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJodG1sXCIpKSl7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNfcmlnaHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHJpZ2h0X2lucHV0KCkpXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNfbGVmdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gbGVmdF9pbnB1dCgpKVxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2dpbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiBjaGFuZ2VfcGFnZShcImxvZ2luXCIpKVxyXG59XHJcblxyXG5cclxuXHJcbi8vIFNVR0dFU1RJT05TIFBBR0VcclxuaWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJzdWdnZXN0aW9ucy5odG1sXCIpKXtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKS5mb3JFYWNoKGNhcmQgPT4gY2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGRlc3Ryb3lQb3N0cygpXHJcbiAgICAgICAgY2hhbmdlVGFyZ2V0KGNhcmQpO1xyXG4gICAgICAgIGxvYWRQb3N0c0Zyb21DYXRlZ29yeSgpO1xyXG4gICAgfSkpXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaC1mb3JtXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIixmaW5kQnlTdWJTdHJpbmcpXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgYXN5bmMgKCk9PiB7XHJcbiAgICAgICAgY2hlY2tJZkd1ZXN0KClcclxuICAgICAgICBsb2FkQWxsU3VnZ2VzdGlvbnMoKVxyXG4gICAgfSlcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zdFwiKS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIscG9zdFN1Z2dlc3Rpb24pXHJcbn0iLCJmdW5jdGlvbiB1cGRhdGVDbGFzc2VzKGN1cnIsbmV4dCl7XHJcbiAgICBjdXJyLmNsYXNzTGlzdC5yZW1vdmUoXCJjdXJyZW50LXNsaWRlXCIpXHJcbiAgICBuZXh0LmNsYXNzTGlzdC5hZGQoXCJjdXJyZW50LXNsaWRlXCIpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxlZnRfaW5wdXQoKXtcclxuICAgIGNvbnN0IGltZ1dyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImltZy13cmFwcGVyXCIpO1xyXG4gICAgY29uc3Qgc2xpZGVzID0gQXJyYXkuZnJvbShpbWdXcmFwcGVyLmNoaWxkcmVuKTtcclxuICAgIGNvbnN0IGN1cnJlbnRTbGlkZSA9IGltZ1dyYXBwZXIucXVlcnlTZWxlY3RvcihcIi5jdXJyZW50LXNsaWRlXCIpXHJcbiAgICBjb25zdCBjdXJyZW50U2xpZGVJbmRleCA9IHNsaWRlcy5pbmRleE9mKGN1cnJlbnRTbGlkZSlcclxuICAgIHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG5cclxuICAgIGxldCBuZXh0U2xpZGUgPSBjdXJyZW50U2xpZGUucHJldmlvdXNFbGVtZW50U2libGluZztcclxuXHJcbiAgICBpZihjdXJyZW50U2xpZGVJbmRleCA9PSAwKXtcclxuICAgICAgICBuZXh0U2xpZGUgPSBzbGlkZXNbM11cclxuICAgICAgICBpbWdXcmFwcGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7LXdpZHRoKjN9cHgpYFxyXG4gICAgICAgIFxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgaW1nV3JhcHBlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgkey13aWR0aCooY3VycmVudFNsaWRlSW5kZXgtMSl9cHgpYFxyXG4gICAgfVxyXG4gICAgY3VycmVudFNsaWRlLmNsYXNzTGlzdC5yZW1vdmUoXCJjdXJyZW50LXNsaWRlXCIpXHJcbiAgICBuZXh0U2xpZGUuY2xhc3NMaXN0LmFkZChcImN1cnJlbnQtc2xpZGVcIilcclxufVxyXG5cclxuZnVuY3Rpb24gcmlnaHRfaW5wdXQoKXtcclxuICAgIGNvbnN0IGltZ1dyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImltZy13cmFwcGVyXCIpO1xyXG4gICAgY29uc3Qgc2xpZGVzID0gQXJyYXkuZnJvbShpbWdXcmFwcGVyLmNoaWxkcmVuKTtcclxuICAgIGNvbnN0IGN1cnJlbnRTbGlkZSA9IGltZ1dyYXBwZXIucXVlcnlTZWxlY3RvcihcIi5jdXJyZW50LXNsaWRlXCIpXHJcbiAgICBjb25zdCBjdXJyZW50U2xpZGVJbmRleCA9IHNsaWRlcy5pbmRleE9mKGN1cnJlbnRTbGlkZSlcclxuICAgIHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG5cclxuICAgIGxldCBuZXh0U2xpZGUgPSBjdXJyZW50U2xpZGUubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG5cclxuICAgIGlmKGN1cnJlbnRTbGlkZUluZGV4KzEgPT09IHNsaWRlcy5sZW5ndGgpe1xyXG4gICAgICAgIG5leHRTbGlkZSA9IHNsaWRlc1swXVxyXG4gICAgICAgIGltZ1dyYXBwZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoLSR7d2lkdGgqMH1weClgXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBpbWdXcmFwcGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKC0ke3dpZHRoKihjdXJyZW50U2xpZGVJbmRleCsxKX1weClgXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQ2xhc3NlcyhjdXJyZW50U2xpZGUsbmV4dFNsaWRlKVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtsZWZ0X2lucHV0LHJpZ2h0X2lucHV0fSIsImZ1bmN0aW9uIGNoYW5nZVRhcmdldChjYXJkKXtcclxuICAgIGNvbnN0IG9sZENhcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRhcmdldFwiKTtcclxuXHJcbiAgICBpZihvbGRDYXJkID09PSBudWxsKXtcclxuICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoXCJ0YXJnZXRcIilcclxuICAgIH1lbHNle1xyXG4gICAgICAgIG9sZENhcmQuY2xhc3NMaXN0LnJlbW92ZShcInRhcmdldFwiKVxyXG4gICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZChcInRhcmdldFwiKVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVQb3N0KGlkLHRpdGxlLGNhdGVnb3J5LGRlc2Mpe1xyXG4gICAgY29uc3QgcGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgcGFyZW50LmNsYXNzTGlzdC5hZGQoXCJwb3N0XCIpXHJcbiAgICBwYXJlbnQuc2V0QXR0cmlidXRlKFwiaWRcIixgcG9zdCR7aWR9YClcclxuXHJcbiAgICBjb25zdCB0aXRsZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuICAgIHRpdGxlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJ0aXRsZUNvbnRhaW5lclwiKVxyXG5cclxuICAgIGNvbnN0IHRpdGxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDVcIilcclxuICAgIHRpdGxlRWwudGV4dENvbnRlbnQgPSB0aXRsZVxyXG4gICAgdGl0bGVDb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGVFbClcclxuXHJcbiAgICBjb25zdCBjYXRlZ29yeUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg2XCIpXHJcbiAgICBjYXRlZ29yeUVsLnRleHRDb250ZW50ID0gXCItXCIrY2F0ZWdvcnlcclxuICAgIHRpdGxlQ29udGFpbmVyLmFwcGVuZENoaWxkKGNhdGVnb3J5RWwpIFxyXG5cclxuICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aXRsZUNvbnRhaW5lcilcclxuXHJcbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIilcclxuICAgIGNvbnRlbnQudGV4dENvbnRlbnQgPSBkZXNjXHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY29udGVudClcclxuXHJcbiAgICByZXR1cm4gcGFyZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNvbHZlQ2F0ZWdvcnkoY2F0KXtcclxuICAgIGlmKGNhdCA9PT0gXCJQdWJsaWMgU2VydmljZXNcIiB8fCBjYXQgPT09IFwicHVibGljc2VydmljZXNcIil7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9ZWxzZSBpZihjYXQgPT09IFwiUmVjeWNsaW5nXCIgfHwgY2F0ID09PSBcInJlY3ljbGluZ1wiKXtcclxuICAgICAgICByZXR1cm4gMjtcclxuICAgIH1lbHNlIGlmKGNhdCA9PT0gXCJMYW5kc2NhcGVcIiB8fCBjYXQgPT09IFwibGFuZHNjYXBlXCIpe1xyXG4gICAgICAgIHJldHVybiAzO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgcmV0dXJuIDQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlc3Ryb3lQb3N0cygpe1xyXG4gICAgY29uc3QgcG9zdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicG9zdFwiKVxyXG4gICAgaWYocG9zdHMubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgd2hpbGUocG9zdHMubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIHBvc3RzWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocG9zdHNbMF0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaW5kQnlTdWJTdHJpbmcoZSl7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBkZXN0cm95UG9zdHMoKTtcclxuICAgIGNvbnN0IHN1Z2dDb250ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdWdnZXN0aW9uc1wiKVxyXG4gICAgY29uc3Qgc3ViU3RyaW5nID0gZS50YXJnZXQuc2VhcmNoLnZhbHVlO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9zdWdnZXN0aW9uc1wiKVxyXG4gICAgY29uc3QgcG9zdHMgPSBhd2FpdCByZXNwb25zZS5qc29uKClcclxuXHJcbiAgICBjb25zdCBxdWVyaWVkUG9zdHMgPSBbXTtcclxuICAgIHBvc3RzLmZvckVhY2gocG9zdCA9PiB7XHJcbiAgICAgICAgaWYocG9zdC50aXRsZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHN1YlN0cmluZy50b0xvd2VyQ2FzZSgpKSl7XHJcbiAgICAgICAgICAgIHF1ZXJpZWRQb3N0cy5wdXNoKHBvc3QpXHJcbiAgICAgICAgfWVsc2UgaWYocG9zdC5jYXRlZ29yeV9uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc3ViU3RyaW5nLnRvTG93ZXJDYXNlKCkpKXtcclxuICAgICAgICAgICAgcXVlcmllZFBvc3RzLnB1c2gocG9zdClcclxuICAgICAgICB9ZWxzZSBpZihwb3N0LmNvbnRlbnQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzdWJTdHJpbmcudG9Mb3dlckNhc2UoKSkpe1xyXG4gICAgICAgICAgICBxdWVyaWVkUG9zdHMucHVzaChwb3N0KVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBxdWVyaWVkUG9zdHMuZm9yRWFjaChwb3N0ID0+IHtcclxuICAgICAgICBjb25zdCBuZXdQb3N0ID0gY3JlYXRlUG9zdChwb3N0LmlkLHBvc3QudGl0bGUscG9zdC5jYXRlZ29yeV9uYW1lLHBvc3QuY29udGVudClcclxuICAgICAgICBzdWdnQ29udC5hcHBlbmRDaGlsZChuZXdQb3N0KVxyXG4gICAgfSlcclxufVxyXG5cclxuXHJcbi8vIEdFVCBBTEwgU1VHR0VTVElPTlNcclxuYXN5bmMgZnVuY3Rpb24gbG9hZEFsbFN1Z2dlc3Rpb25zKCl7XHJcbiAgICBjb25zdCBzdWdnZXN0aW9uc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VnZ2VzdGlvbnNcIilcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvc3VnZ2VzdGlvbnNcIilcclxuICAgICAgICBjb25zdCBwb3N0cyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgICAgIHBvc3RzLmZvckVhY2gocG9zdCA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3UG9zdCA9IGNyZWF0ZVBvc3QocG9zdC5pZCxwb3N0LnRpdGxlLHBvc3QuY2F0ZWdvcnlfbmFtZSxwb3N0LmNvbnRlbnQpXHJcbiAgICAgICAgc3VnZ2VzdGlvbnNDb250YWluZXIuYXBwZW5kQ2hpbGQobmV3UG9zdClcclxuICAgIH0pXHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlJlbmRlcmluZyBiZWZvcmUgbG9hZGVkIGNvbnRlbnQuXCIsIGVyci5tZXNzYWdlKVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBsb2FkUG9zdHNGcm9tQ2F0ZWdvcnkoKXtcclxuICAgIFxyXG4gICAgY29uc3Qgc3VnZ0NvbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN1Z2dlc3Rpb25zXCIpXHJcbiAgICBjb25zdCB0b3BpYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFyZ2V0XCIpXHJcbiAgICBjb25zdCBwb3N0SWR4ID0gcmVzb2x2ZUNhdGVnb3J5KHRvcGljLmlkKVxyXG5cclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9jYXRlZ29yaWVzLyR7cG9zdElkeH0vc3VnZ2VzdGlvbnNgKVxyXG4gICAgY29uc3QgcG9zdHMgPSBhd2FpdCByZXNwb25zZS5qc29uKClcclxuXHJcbiAgICBwb3N0cy5mb3JFYWNoKHBvc3QgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5ld1Bvc3QgPSBjcmVhdGVQb3N0KHBvc3QuaWQscG9zdC50aXRsZSxwb3N0LmNhdGVnb3J5X25hbWUscG9zdC5jb250ZW50KVxyXG4gICAgICAgIHN1Z2dDb250LmFwcGVuZENoaWxkKG5ld1Bvc3QpXHJcbiAgICB9KVxyXG5cclxuICAgIFxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXRVc2VySWQoKXtcclxuICAgIGNvbnN0IHNlc3Npb25Ub2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKVxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC91c2Vycy90b2tlbnNcIilcclxuICAgIGNvbnN0IHRva2VucyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG5cclxuICAgIGZvcih0IGluIHRva2Vucyl7XHJcbiAgICAgICAgaWYodG9rZW5zW3RdLnRva2VuID09PSBzZXNzaW9uVG9rZW4pe1xyXG4gICAgICAgICAgICByZXR1cm4gdG9rZW5zW3RdLnVzZXJfaWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBwb3N0U3VnZ2VzdGlvbihlKXtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgIGNvbnN0IHRpdGxlRW50cnkgPSBlLnRhcmdldC50aXRsZS52YWx1ZTtcclxuICAgIGNvbnN0IGNhdGVnb3J5ID0gZS50YXJnZXQuY2F0ZWdvcnkudmFsdWU7XHJcbiAgICBjb25zdCBkZXNjRW50cnkgPSBlLnRhcmdldC5jb250ZW50LnZhbHVlO1xyXG5cclxuICAgIC8vIGNvbnN0IHBvc3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBvc3RcIilcclxuXHJcbiAgICBjb25zdCBjYXRJZHggPSByZXNvbHZlQ2F0ZWdvcnkoY2F0ZWdvcnkpO1xyXG5cclxuICAgIGNvbnN0IHVzZXJJZCA9IGF3YWl0IGdldFVzZXJJZCgpXHJcblxyXG4gICAgaWYodGl0bGVFbnRyeS50cmltKCkubGVuZ3RoID4gMCAmJiBkZXNjRW50cnkudHJpbSgpLmxlbmd0aCA+MCl7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOlwiUE9TVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOntcIkNvbnRlbnQtVHlwZVwiOlwiYXBwbGljYXRpb24vanNvblwifSxcclxuICAgICAgICAgICAgYm9keTpKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeV9uYW1lOmNhdGVnb3J5LFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6dGl0bGVFbnRyeSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ZGVzY0VudHJ5LFxyXG4gICAgICAgICAgICAgICAgdXNlcl9pZDp1c2VySWRcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDozMDAwL2NhdGVnb3JpZXMvJHtjYXRJZHh9L3N1Z2dlc3Rpb25zYCxvcHRpb25zKVxyXG4gICAgICAgIGNvbnN0IHJlc3AgPSByZXNwb25zZS5qc29uKClcclxuICAgICAgICBkZXN0cm95UG9zdHMoKVxyXG4gICAgICAgIGxvYWRBbGxTdWdnZXN0aW9ucygpXHJcbiAgICB9XHJcbiAgICBlLnRhcmdldC50aXRsZS52YWx1ZSA9IFwiXCI7XHJcbiAgICBlLnRhcmdldC5jb250ZW50LnZhbHVlID0gXCJcIjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7Y2hhbmdlVGFyZ2V0LGZpbmRCeVN1YlN0cmluZyxsb2FkQWxsU3VnZ2VzdGlvbnMsIHBvc3RTdWdnZXN0aW9uLGxvYWRQb3N0c0Zyb21DYXRlZ29yeSxkZXN0cm95UG9zdHN9IiwiY29uc3QgY2hlY2tMb2dnZWRJbiA9IGFzeW5jICgpID0+e1xyXG4gICAgbGV0IHRva2VuID0gXCJcIlxyXG4gICAgdHJ5IHtcclxuICAgICAgICB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmKHRva2VuLmxlbmd0aCA+IDApe1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvdXNlcnMvdG9rZW5zXCIpXHJcbiAgICAgICAgY29uc3QgcmVzcFRva2VuID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcbiAgICAgICAgbGV0IHVzZXIgPSBcIlwiO1xyXG5cclxuICAgICAgICBmb3IodCBpbiByZXNwVG9rZW4pe1xyXG4gICAgICAgICAgICBpZiAocmVzcFRva2VuW3RdLnRva2VuID09IHRva2VuKXtcclxuICAgICAgICAgICAgICAgIHVzZXIgPSBhd2FpdCBnZXRVc2VybmFtZShyZXNwVG9rZW5bdF0udXNlcl9pZClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBkaXNhYmxlTG9naW4odXNlcilcclxuICAgICAgICBjcmVhdGVTaWduT3V0KHVzZXIpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIk5vIG9uZSBpcyBsb2dnZWQgaW4uXCIpXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGNyZWF0ZVNpZ25PdXQgPSAodXNlcm5hbWUpID0+IHtcclxuICAgIGNvbnN0IHVzZXJuYW1lRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hdnVzZXJuYW1lXCIpXHJcbiAgICBpZih1c2VybmFtZSl7XHJcbiAgICAgICAgdXNlcm5hbWVFbC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCJcclxuICAgICAgICB1c2VybmFtZUVsLnRleHRDb250ZW50ID0gYCR7dXNlcm5hbWV9YFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9nb3V0XCIpLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIlxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgdXNlcm5hbWVFbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcclxuICAgICAgICB1c2VybmFtZUVsLnRleHRDb250ZW50ID0gXCJcIlxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9nb3V0XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbmNvbnN0IGRpc2FibGVMb2dpbiA9ICh1c2VybmFtZSkgPT4ge1xyXG4gICAgaWYodXNlcm5hbWUpe1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWdpc3RlclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5cIikuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWdpc3RlclwiKS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCJcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgZ2V0VXNlcm5hbWUgPSBhc3luYyAodXNlcl9pZCkgPT4ge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDozMDAwL3VzZXJzYClcclxuICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcbiAgICBsZXQgdXNlcm5hbWU7XHJcbiAgICBmb3IodSBpbiB1c2Vycyl7XHJcbiAgICAgICAgaWYodXNlcnNbdV0uaWQgPT09IHVzZXJfaWQpe1xyXG4gICAgICAgICAgICByZXR1cm4gdXNlcnNbdV0udXNlcm5hbWVcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGdldFVzZXIgPSBhc3luYyAodXNlcl9pZCkgPT4ge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDozMDAwL3VzZXJzYClcclxuICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcbiAgICBsZXQgdXNlcm5hbWU7XHJcbiAgICBmb3IodSBpbiB1c2Vycyl7XHJcbiAgICAgICAgaWYodXNlcnNbdV0uaWQgPT09IHVzZXJfaWQpe1xyXG4gICAgICAgICAgICByZXR1cm4gdXNlcnNbdV1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGxvZ091dCA9IGFzeW5jICgpID0+IHtcclxuICAgIGxvY2FsVG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIilcclxuXHJcbiAgICBsZXQgdXNlcjtcclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL3VzZXJzL3Rva2Vuc1wiKVxyXG4gICAgY29uc3QgcmVzcFRva2VuID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcbiAgICBmb3IodCBpbiByZXNwVG9rZW4pe1xyXG4gICAgICAgIGlmIChyZXNwVG9rZW5bdF0udG9rZW4gPT0gbG9jYWxUb2tlbil7XHJcbiAgICAgICAgICAgIHVzZXIgPSBhd2FpdCBnZXRVc2VyKHJlc3BUb2tlblt0XS51c2VyX2lkKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oXCJ0b2tlblwiKTtcclxuICAgIGRlbGV0ZUN1cnJlbnRVc2VyKHVzZXIpXHJcbiAgICBjcmVhdGVTaWduT3V0KClcclxuICAgIGRpc2FibGVMb2dpbigpXHJcbn1cclxuXHJcbmNvbnN0IGRlbGV0ZUN1cnJlbnRVc2VyID0gYXN5bmMgKHVzZXIpID0+IHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgbWV0aG9kOlwiREVMRVRFXCIsXHJcbiAgICAgICAgaGVhZGVyczp7XCJDb250ZW50LVR5cGVcIjpcImFwcGxpY2F0aW9uL2pzb25cIn0sXHJcbiAgICAgICAgYm9keTpudWxsXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjMwMDAvdXNlcnMvdG9rZW5zLyR7dXNlci5pZH1gLG9wdGlvbnMpXHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrSWZHdWVzdCA9ICgpID0+IHtcclxuICAgIGlmKCEoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpKSl7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3N0XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7Y2hlY2tMb2dnZWRJbixsb2dPdXQsY2hlY2tJZkd1ZXN0fSJdfQ==
