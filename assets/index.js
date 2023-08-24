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