import { change_page ,left_input,right_input} from "./navigation.js"

window.addEventListener("resize", () => width = window.innerWidth)

document.getElementById("c_right").addEventListener("click", () => right_input())
document.getElementById("c_left").addEventListener("click", () => left_input())
document.querySelector(".loginBtn").addEventListener("click",() => change_page("login"))
