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