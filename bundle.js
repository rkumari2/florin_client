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
    const response = await fetch("https://florin-server-ijt6.onrender.com/suggestions")
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
        const response = await fetch("https://florin-server-ijt6.onrender.com/suggestions")
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

    const response = await fetch(`https://florin-server-ijt6.onrender.com/categories/${postIdx}/suggestions`)
    const posts = await response.json()

    posts.forEach(post => {
        const newPost = createPost(post.id,post.title,post.category_name,post.content)
        suggCont.appendChild(newPost)
    })

    
}

async function getUserId(){
    const sessionToken = sessionStorage.getItem("token")
    const response = await fetch("https://florin-server-ijt6.onrender.com/users/tokens")
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
        const response = await fetch(`https://florin-server-ijt6.onrender.com/categories/${catIdx}/suggestions`,options)
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
        const response = await fetch("https://florin-server-ijt6.onrender.com/users/tokens")
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
    const response = await fetch(`https://florin-server-ijt6.onrender.com/users`)
    const users = await response.json()
    let username;
    for(u in users){
        if(users[u].id === user_id){
            return users[u].username
        }
    }
}

const getUser = async (user_id) => {
    const response = await fetch(`https://florin-server-ijt6.onrender.com/users`)
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

    const response = await fetch("https://florin-server-ijt6.onrender.com/users/tokens")
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
    const response = await fetch(`https://florin-server-ijt6.onrender.com/users/tokens/${user.id}`,options)
}

const checkIfGuest = () => {
    if(!(sessionStorage.getItem("token"))){
        document.getElementById("post").style.display = "none";
        document.getElementById("suggTitle").textContent = "Log In To Make a Suggestion"
    }
}

module.exports = {checkLoggedIn,logOut,checkIfGuest}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvaW5kZXguanMiLCJhc3NldHMvbmF2aWdhdGlvbi5qcyIsImFzc2V0cy9zdWdnZXN0aW9ucy5qcyIsImFzc2V0cy91c2VyTG9nZ2VkSW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IHtsZWZ0X2lucHV0LHJpZ2h0X2lucHV0fSA9IHJlcXVpcmUoXCIuL25hdmlnYXRpb25cIilcclxuY29uc3Qge2NoZWNrTG9nZ2VkSW4sbG9nT3V0LGNoZWNrSWZHdWVzdH0gPSByZXF1aXJlKFwiLi91c2VyTG9nZ2VkSW5cIilcclxuY29uc3Qge2NoYW5nZVRhcmdldCxmaW5kQnlTdWJTdHJpbmcsbG9hZEFsbFN1Z2dlc3Rpb25zLHBvc3RTdWdnZXN0aW9uLGxvYWRQb3N0c0Zyb21DYXRlZ29yeSxkZXN0cm95UG9zdHN9ID0gcmVxdWlyZShcIi4vc3VnZ2VzdGlvbnNcIilcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBhc3luYyAoKSA9PiBjaGVja0xvZ2dlZEluKCkpXHJcblxyXG4vLyBTaWduIE91dFxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hdmxvZ291dFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCk9PiB7XHJcbiAgICBhd2FpdCBsb2dPdXQoKVxyXG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi4vaW5kZXguaHRtbFwiXHJcbn0pXHJcblxyXG4vLyBIT01FIFBBR0VcclxuaWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJpbmRleC5odG1sXCIpIHx8ICEobG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcImh0bWxcIikpKXtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY19yaWdodFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gcmlnaHRfaW5wdXQoKSlcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY19sZWZ0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBsZWZ0X2lucHV0KCkpXHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxvZ2luQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCgpID0+IGNoYW5nZV9wYWdlKFwibG9naW5cIikpXHJcbn1cclxuXHJcblxyXG5cclxuLy8gU1VHR0VTVElPTlMgUEFHRVxyXG5pZih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcInN1Z2dlc3Rpb25zLmh0bWxcIikpe1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpLmZvckVhY2goY2FyZCA9PiBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgZGVzdHJveVBvc3RzKClcclxuICAgICAgICBjaGFuZ2VUYXJnZXQoY2FyZCk7XHJcbiAgICAgICAgbG9hZFBvc3RzRnJvbUNhdGVnb3J5KCk7XHJcbiAgICB9KSlcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoLWZvcm1cIikuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLGZpbmRCeVN1YlN0cmluZylcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBhc3luYyAoKT0+IHtcclxuICAgICAgICBjaGVja0lmR3Vlc3QoKVxyXG4gICAgICAgIGxvYWRBbGxTdWdnZXN0aW9ucygpXHJcbiAgICB9KVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3N0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIixwb3N0U3VnZ2VzdGlvbilcclxufSIsImZ1bmN0aW9uIHVwZGF0ZUNsYXNzZXMoY3VycixuZXh0KXtcclxuICAgIGN1cnIuY2xhc3NMaXN0LnJlbW92ZShcImN1cnJlbnQtc2xpZGVcIilcclxuICAgIG5leHQuY2xhc3NMaXN0LmFkZChcImN1cnJlbnQtc2xpZGVcIilcclxufVxyXG5cclxuZnVuY3Rpb24gbGVmdF9pbnB1dCgpe1xyXG4gICAgY29uc3QgaW1nV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW1nLXdyYXBwZXJcIik7XHJcbiAgICBjb25zdCBzbGlkZXMgPSBBcnJheS5mcm9tKGltZ1dyYXBwZXIuY2hpbGRyZW4pO1xyXG4gICAgY29uc3QgY3VycmVudFNsaWRlID0gaW1nV3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnQtc2xpZGVcIilcclxuICAgIGNvbnN0IGN1cnJlbnRTbGlkZUluZGV4ID0gc2xpZGVzLmluZGV4T2YoY3VycmVudFNsaWRlKVxyXG4gICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblxyXG4gICAgbGV0IG5leHRTbGlkZSA9IGN1cnJlbnRTbGlkZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG5cclxuICAgIGlmKGN1cnJlbnRTbGlkZUluZGV4ID09IDApe1xyXG4gICAgICAgIG5leHRTbGlkZSA9IHNsaWRlc1szXVxyXG4gICAgICAgIGltZ1dyYXBwZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHstd2lkdGgqM31weClgXHJcbiAgICAgICAgXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBpbWdXcmFwcGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7LXdpZHRoKihjdXJyZW50U2xpZGVJbmRleC0xKX1weClgXHJcbiAgICB9XHJcbiAgICBjdXJyZW50U2xpZGUuY2xhc3NMaXN0LnJlbW92ZShcImN1cnJlbnQtc2xpZGVcIilcclxuICAgIG5leHRTbGlkZS5jbGFzc0xpc3QuYWRkKFwiY3VycmVudC1zbGlkZVwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiByaWdodF9pbnB1dCgpe1xyXG4gICAgY29uc3QgaW1nV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW1nLXdyYXBwZXJcIik7XHJcbiAgICBjb25zdCBzbGlkZXMgPSBBcnJheS5mcm9tKGltZ1dyYXBwZXIuY2hpbGRyZW4pO1xyXG4gICAgY29uc3QgY3VycmVudFNsaWRlID0gaW1nV3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnQtc2xpZGVcIilcclxuICAgIGNvbnN0IGN1cnJlbnRTbGlkZUluZGV4ID0gc2xpZGVzLmluZGV4T2YoY3VycmVudFNsaWRlKVxyXG4gICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblxyXG4gICAgbGV0IG5leHRTbGlkZSA9IGN1cnJlbnRTbGlkZS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgaWYoY3VycmVudFNsaWRlSW5kZXgrMSA9PT0gc2xpZGVzLmxlbmd0aCl7XHJcbiAgICAgICAgbmV4dFNsaWRlID0gc2xpZGVzWzBdXHJcbiAgICAgICAgaW1nV3JhcHBlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgtJHt3aWR0aCowfXB4KWBcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGltZ1dyYXBwZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoLSR7d2lkdGgqKGN1cnJlbnRTbGlkZUluZGV4KzEpfXB4KWBcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDbGFzc2VzKGN1cnJlbnRTbGlkZSxuZXh0U2xpZGUpXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2xlZnRfaW5wdXQscmlnaHRfaW5wdXR9IiwiZnVuY3Rpb24gY2hhbmdlVGFyZ2V0KGNhcmQpe1xyXG4gICAgY29uc3Qgb2xkQ2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFyZ2V0XCIpO1xyXG5cclxuICAgIGlmKG9sZENhcmQgPT09IG51bGwpe1xyXG4gICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZChcInRhcmdldFwiKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgb2xkQ2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwidGFyZ2V0XCIpXHJcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKFwidGFyZ2V0XCIpXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBvc3QoaWQsdGl0bGUsY2F0ZWdvcnksZGVzYyl7XHJcbiAgICBjb25zdCBwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcbiAgICBwYXJlbnQuY2xhc3NMaXN0LmFkZChcInBvc3RcIilcclxuICAgIHBhcmVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLGBwb3N0JHtpZH1gKVxyXG5cclxuICAgIGNvbnN0IHRpdGxlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgdGl0bGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInRpdGxlQ29udGFpbmVyXCIpXHJcblxyXG4gICAgY29uc3QgdGl0bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNVwiKVxyXG4gICAgdGl0bGVFbC50ZXh0Q29udGVudCA9IHRpdGxlXHJcbiAgICB0aXRsZUNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZUVsKVxyXG5cclxuICAgIGNvbnN0IGNhdGVnb3J5RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDZcIilcclxuICAgIGNhdGVnb3J5RWwudGV4dENvbnRlbnQgPSBcIi1cIitjYXRlZ29yeVxyXG4gICAgdGl0bGVDb250YWluZXIuYXBwZW5kQ2hpbGQoY2F0ZWdvcnlFbCkgXHJcblxyXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRpdGxlQ29udGFpbmVyKVxyXG5cclxuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKVxyXG4gICAgY29udGVudC50ZXh0Q29udGVudCA9IGRlc2NcclxuICAgIHBhcmVudC5hcHBlbmRDaGlsZChjb250ZW50KVxyXG5cclxuICAgIHJldHVybiBwYXJlbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc29sdmVDYXRlZ29yeShjYXQpe1xyXG4gICAgaWYoY2F0ID09PSBcIlB1YmxpYyBTZXJ2aWNlc1wiIHx8IGNhdCA9PT0gXCJwdWJsaWNzZXJ2aWNlc1wiKXtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH1lbHNlIGlmKGNhdCA9PT0gXCJSZWN5Y2xpbmdcIiB8fCBjYXQgPT09IFwicmVjeWNsaW5nXCIpe1xyXG4gICAgICAgIHJldHVybiAyO1xyXG4gICAgfWVsc2UgaWYoY2F0ID09PSBcIkxhbmRzY2FwZVwiIHx8IGNhdCA9PT0gXCJsYW5kc2NhcGVcIil7XHJcbiAgICAgICAgcmV0dXJuIDM7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICByZXR1cm4gNDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVzdHJveVBvc3RzKCl7XHJcbiAgICBjb25zdCBwb3N0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwb3N0XCIpXHJcbiAgICBpZihwb3N0cy5sZW5ndGggPiAwKXtcclxuICAgICAgICB3aGlsZShwb3N0cy5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgcG9zdHNbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwb3N0c1swXSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZpbmRCeVN1YlN0cmluZyhlKXtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGRlc3Ryb3lQb3N0cygpO1xyXG4gICAgY29uc3Qgc3VnZ0NvbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN1Z2dlc3Rpb25zXCIpXHJcbiAgICBjb25zdCBzdWJTdHJpbmcgPSBlLnRhcmdldC5zZWFyY2gudmFsdWU7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cHM6Ly9mbG9yaW4tc2VydmVyLWlqdDYub25yZW5kZXIuY29tL3N1Z2dlc3Rpb25zXCIpXHJcbiAgICBjb25zdCBwb3N0cyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG5cclxuICAgIGNvbnN0IHF1ZXJpZWRQb3N0cyA9IFtdO1xyXG4gICAgcG9zdHMuZm9yRWFjaChwb3N0ID0+IHtcclxuICAgICAgICBpZihwb3N0LnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc3ViU3RyaW5nLnRvTG93ZXJDYXNlKCkpKXtcclxuICAgICAgICAgICAgcXVlcmllZFBvc3RzLnB1c2gocG9zdClcclxuICAgICAgICB9ZWxzZSBpZihwb3N0LmNhdGVnb3J5X25hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzdWJTdHJpbmcudG9Mb3dlckNhc2UoKSkpe1xyXG4gICAgICAgICAgICBxdWVyaWVkUG9zdHMucHVzaChwb3N0KVxyXG4gICAgICAgIH1lbHNlIGlmKHBvc3QuY29udGVudC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHN1YlN0cmluZy50b0xvd2VyQ2FzZSgpKSl7XHJcbiAgICAgICAgICAgIHF1ZXJpZWRQb3N0cy5wdXNoKHBvc3QpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHF1ZXJpZWRQb3N0cy5mb3JFYWNoKHBvc3QgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5ld1Bvc3QgPSBjcmVhdGVQb3N0KHBvc3QuaWQscG9zdC50aXRsZSxwb3N0LmNhdGVnb3J5X25hbWUscG9zdC5jb250ZW50KVxyXG4gICAgICAgIHN1Z2dDb250LmFwcGVuZENoaWxkKG5ld1Bvc3QpXHJcbiAgICB9KVxyXG59XHJcblxyXG5cclxuLy8gR0VUIEFMTCBTVUdHRVNUSU9OU1xyXG5hc3luYyBmdW5jdGlvbiBsb2FkQWxsU3VnZ2VzdGlvbnMoKXtcclxuICAgIGNvbnN0IHN1Z2dlc3Rpb25zQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdWdnZXN0aW9uc1wiKVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHBzOi8vZmxvcmluLXNlcnZlci1panQ2Lm9ucmVuZGVyLmNvbS9zdWdnZXN0aW9uc1wiKVxyXG4gICAgICAgIGNvbnN0IHBvc3RzID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcbiAgICAgICAgcG9zdHMuZm9yRWFjaChwb3N0ID0+IHtcclxuICAgICAgICBjb25zdCBuZXdQb3N0ID0gY3JlYXRlUG9zdChwb3N0LmlkLHBvc3QudGl0bGUscG9zdC5jYXRlZ29yeV9uYW1lLHBvc3QuY29udGVudClcclxuICAgICAgICBzdWdnZXN0aW9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChuZXdQb3N0KVxyXG4gICAgfSlcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVuZGVyaW5nIGJlZm9yZSBsb2FkZWQgY29udGVudC5cIiwgZXJyLm1lc3NhZ2UpXHJcbiAgICB9XHJcblxyXG4gICAgXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGxvYWRQb3N0c0Zyb21DYXRlZ29yeSgpe1xyXG4gICAgXHJcbiAgICBjb25zdCBzdWdnQ29udCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VnZ2VzdGlvbnNcIilcclxuICAgIGNvbnN0IHRvcGljID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXJnZXRcIilcclxuICAgIGNvbnN0IHBvc3RJZHggPSByZXNvbHZlQ2F0ZWdvcnkodG9waWMuaWQpXHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9mbG9yaW4tc2VydmVyLWlqdDYub25yZW5kZXIuY29tL2NhdGVnb3JpZXMvJHtwb3N0SWR4fS9zdWdnZXN0aW9uc2ApXHJcbiAgICBjb25zdCBwb3N0cyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG5cclxuICAgIHBvc3RzLmZvckVhY2gocG9zdCA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3UG9zdCA9IGNyZWF0ZVBvc3QocG9zdC5pZCxwb3N0LnRpdGxlLHBvc3QuY2F0ZWdvcnlfbmFtZSxwb3N0LmNvbnRlbnQpXHJcbiAgICAgICAgc3VnZ0NvbnQuYXBwZW5kQ2hpbGQobmV3UG9zdClcclxuICAgIH0pXHJcblxyXG4gICAgXHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFVzZXJJZCgpe1xyXG4gICAgY29uc3Qgc2Vzc2lvblRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cHM6Ly9mbG9yaW4tc2VydmVyLWlqdDYub25yZW5kZXIuY29tL3VzZXJzL3Rva2Vuc1wiKVxyXG4gICAgY29uc3QgdG9rZW5zID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcblxyXG4gICAgZm9yKHQgaW4gdG9rZW5zKXtcclxuICAgICAgICBpZih0b2tlbnNbdF0udG9rZW4gPT09IHNlc3Npb25Ub2tlbil7XHJcbiAgICAgICAgICAgIHJldHVybiB0b2tlbnNbdF0udXNlcl9pZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHBvc3RTdWdnZXN0aW9uKGUpe1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgY29uc3QgdGl0bGVFbnRyeSA9IGUudGFyZ2V0LnRpdGxlLnZhbHVlO1xyXG4gICAgY29uc3QgY2F0ZWdvcnkgPSBlLnRhcmdldC5jYXRlZ29yeS52YWx1ZTtcclxuICAgIGNvbnN0IGRlc2NFbnRyeSA9IGUudGFyZ2V0LmNvbnRlbnQudmFsdWU7XHJcblxyXG4gICAgLy8gY29uc3QgcG9zdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicG9zdFwiKVxyXG5cclxuICAgIGNvbnN0IGNhdElkeCA9IHJlc29sdmVDYXRlZ29yeShjYXRlZ29yeSk7XHJcblxyXG4gICAgY29uc3QgdXNlcklkID0gYXdhaXQgZ2V0VXNlcklkKClcclxuXHJcbiAgICBpZih0aXRsZUVudHJ5LnRyaW0oKS5sZW5ndGggPiAwICYmIGRlc2NFbnRyeS50cmltKCkubGVuZ3RoID4wKXtcclxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6XCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6e1wiQ29udGVudC1UeXBlXCI6XCJhcHBsaWNhdGlvbi9qc29uXCJ9LFxyXG4gICAgICAgICAgICBib2R5OkpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5X25hbWU6Y2F0ZWdvcnksXHJcbiAgICAgICAgICAgICAgICB0aXRsZTp0aXRsZUVudHJ5LFxyXG4gICAgICAgICAgICAgICAgY29udGVudDpkZXNjRW50cnksXHJcbiAgICAgICAgICAgICAgICB1c2VyX2lkOnVzZXJJZFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2Zsb3Jpbi1zZXJ2ZXItaWp0Ni5vbnJlbmRlci5jb20vY2F0ZWdvcmllcy8ke2NhdElkeH0vc3VnZ2VzdGlvbnNgLG9wdGlvbnMpXHJcbiAgICAgICAgY29uc3QgcmVzcCA9IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgICAgIGRlc3Ryb3lQb3N0cygpXHJcbiAgICAgICAgbG9hZEFsbFN1Z2dlc3Rpb25zKClcclxuICAgIH1cclxuICAgIGUudGFyZ2V0LnRpdGxlLnZhbHVlID0gXCJcIjtcclxuICAgIGUudGFyZ2V0LmNvbnRlbnQudmFsdWUgPSBcIlwiO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtjaGFuZ2VUYXJnZXQsZmluZEJ5U3ViU3RyaW5nLGxvYWRBbGxTdWdnZXN0aW9ucywgcG9zdFN1Z2dlc3Rpb24sbG9hZFBvc3RzRnJvbUNhdGVnb3J5LGRlc3Ryb3lQb3N0c30iLCJjb25zdCBjaGVja0xvZ2dlZEluID0gYXN5bmMgKCkgPT57XHJcbiAgICBsZXQgdG9rZW4gPSBcIlwiXHJcbiAgICB0cnkge1xyXG4gICAgICAgIHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpXHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSlcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYodG9rZW4ubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHBzOi8vZmxvcmluLXNlcnZlci1panQ2Lm9ucmVuZGVyLmNvbS91c2Vycy90b2tlbnNcIilcclxuICAgICAgICBjb25zdCByZXNwVG9rZW4gPSBhd2FpdCByZXNwb25zZS5qc29uKClcclxuICAgICAgICBsZXQgdXNlciA9IFwiXCI7XHJcblxyXG4gICAgICAgIGZvcih0IGluIHJlc3BUb2tlbil7XHJcbiAgICAgICAgICAgIGlmIChyZXNwVG9rZW5bdF0udG9rZW4gPT0gdG9rZW4pe1xyXG4gICAgICAgICAgICAgICAgdXNlciA9IGF3YWl0IGdldFVzZXJuYW1lKHJlc3BUb2tlblt0XS51c2VyX2lkKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpc2FibGVMb2dpbih1c2VyKVxyXG4gICAgICAgIGNyZWF0ZVNpZ25PdXQodXNlcilcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTm8gb25lIGlzIGxvZ2dlZCBpbi5cIilcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgY3JlYXRlU2lnbk91dCA9ICh1c2VybmFtZSkgPT4ge1xyXG4gICAgY29uc3QgdXNlcm5hbWVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmF2dXNlcm5hbWVcIilcclxuICAgIGlmKHVzZXJuYW1lKXtcclxuICAgICAgICB1c2VybmFtZUVsLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIlxyXG4gICAgICAgIHVzZXJuYW1lRWwudGV4dENvbnRlbnQgPSBgJHt1c2VybmFtZX1gXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dvdXRcIikuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICB1c2VybmFtZUVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxyXG4gICAgICAgIHVzZXJuYW1lRWwudGV4dENvbnRlbnQgPSBcIlwiXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dvdXRcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuY29uc3QgZGlzYWJsZUxvZ2luID0gKHVzZXJuYW1lKSA9PiB7XHJcbiAgICBpZih1c2VybmFtZSl7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZ2lzdGVyXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCJcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZ2lzdGVyXCIpLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIlxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBnZXRVc2VybmFtZSA9IGFzeW5jICh1c2VyX2lkKSA9PiB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2Zsb3Jpbi1zZXJ2ZXItaWp0Ni5vbnJlbmRlci5jb20vdXNlcnNgKVxyXG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCByZXNwb25zZS5qc29uKClcclxuICAgIGxldCB1c2VybmFtZTtcclxuICAgIGZvcih1IGluIHVzZXJzKXtcclxuICAgICAgICBpZih1c2Vyc1t1XS5pZCA9PT0gdXNlcl9pZCl7XHJcbiAgICAgICAgICAgIHJldHVybiB1c2Vyc1t1XS51c2VybmFtZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgZ2V0VXNlciA9IGFzeW5jICh1c2VyX2lkKSA9PiB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2Zsb3Jpbi1zZXJ2ZXItaWp0Ni5vbnJlbmRlci5jb20vdXNlcnNgKVxyXG4gICAgY29uc3QgdXNlcnMgPSBhd2FpdCByZXNwb25zZS5qc29uKClcclxuICAgIGxldCB1c2VybmFtZTtcclxuICAgIGZvcih1IGluIHVzZXJzKXtcclxuICAgICAgICBpZih1c2Vyc1t1XS5pZCA9PT0gdXNlcl9pZCl7XHJcbiAgICAgICAgICAgIHJldHVybiB1c2Vyc1t1XVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbG9nT3V0ID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgbG9jYWxUb2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKVxyXG5cclxuICAgIGxldCB1c2VyO1xyXG5cclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwczovL2Zsb3Jpbi1zZXJ2ZXItaWp0Ni5vbnJlbmRlci5jb20vdXNlcnMvdG9rZW5zXCIpXHJcbiAgICBjb25zdCByZXNwVG9rZW4gPSBhd2FpdCByZXNwb25zZS5qc29uKClcclxuICAgIGZvcih0IGluIHJlc3BUb2tlbil7XHJcbiAgICAgICAgaWYgKHJlc3BUb2tlblt0XS50b2tlbiA9PSBsb2NhbFRva2VuKXtcclxuICAgICAgICAgICAgdXNlciA9IGF3YWl0IGdldFVzZXIocmVzcFRva2VuW3RdLnVzZXJfaWQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShcInRva2VuXCIpO1xyXG4gICAgZGVsZXRlQ3VycmVudFVzZXIodXNlcilcclxuICAgIGNyZWF0ZVNpZ25PdXQoKVxyXG4gICAgZGlzYWJsZUxvZ2luKClcclxufVxyXG5cclxuY29uc3QgZGVsZXRlQ3VycmVudFVzZXIgPSBhc3luYyAodXNlcikgPT4ge1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICBtZXRob2Q6XCJERUxFVEVcIixcclxuICAgICAgICBoZWFkZXJzOntcIkNvbnRlbnQtVHlwZVwiOlwiYXBwbGljYXRpb24vanNvblwifSxcclxuICAgICAgICBib2R5Om51bGxcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vZmxvcmluLXNlcnZlci1panQ2Lm9ucmVuZGVyLmNvbS91c2Vycy90b2tlbnMvJHt1c2VyLmlkfWAsb3B0aW9ucylcclxufVxyXG5cclxuY29uc3QgY2hlY2tJZkd1ZXN0ID0gKCkgPT4ge1xyXG4gICAgaWYoIShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIikpKXtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvc3RcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VnZ1RpdGxlXCIpLnRleHRDb250ZW50ID0gXCJMb2cgSW4gVG8gTWFrZSBhIFN1Z2dlc3Rpb25cIlxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtjaGVja0xvZ2dlZEluLGxvZ091dCxjaGVja0lmR3Vlc3R9Il19
