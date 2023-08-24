const {renderDOM} = require("./helpers")

let dom;
let document;
let windowSpy

describe("index.html",() => {
    beforeEach(async () => {
        dom = await renderDOM("./index.html")
        document = await dom.window.document;
    })
    it("Has a navbar.",()=>{
        const navbar = document.querySelector(".navbar")
        expect(navbar).toBeTruthy()
    })
    it("Navbar contains link to Home.",()=>{
        const navbar = document.querySelector(".navbar")
        const home = navbar.querySelector("#navindex").href.split("/");
        expect(home[home.length-1]).toBe("index.html")
    })
    it("Navbar contains link to Suggestions.",()=>{
        const navbar = document.querySelector(".navbar")
        const home = navbar.querySelector("#navsuggestions").href.split("/");
        expect(home[home.length-1]).toBe("suggestions.html")
    })
    it("Navbar contains link to Login.",()=>{
        const navbar = document.querySelector(".navbar")
        const home = navbar.querySelector("#navlogin").href.split("/");
        expect(home[home.length-1]).toBe("login.html")
    })
    it("Navbar contains link to Register.",()=>{
        const navbar = document.querySelector(".navbar")
        const home = navbar.querySelector("#navregister").href.split("/");
        expect(home[home.length-1]).toBe("register.html")
    })
    
    it("Image 0 loads with 'current-slide' class.",()=>{
        const slides = document.querySelectorAll(".image")
        expect(slides[0].className).toContain("current-slide")
    })
    it("Loads 4 images into carousel.",()=>{
        const slides = document.querySelectorAll(".image")
        slides.forEach(slide => expect(slide.nodeName).toBe("IMG"))
    })
    it("Log In middle button takes user to login page.",()=>{
        const loginBtn = document.querySelector(".loginBtn")
        loginBtn.click()
    })
    it("Moves class 'current-slide' to next sibling image.",()=>{
        const slides = document.querySelectorAll(".image")
        const rightBtn = document.querySelector("#c_right")
        expect(slides[0].className).toContain("current-slide")
        rightBtn.click()
        expect(slides[1].className).toContain("current-slide")
    })
    it("Moves class 'current-slide' to previous sibling image",()=>{
        const slides = document.querySelectorAll(".image")
        const leftBtn = document.querySelector("#c_left")
        slides[2].classList.add("current-slide")
        slides[0].classList.remove("current-slide")

        leftBtn.click()
        expect(slides[2].className).not.toContain("current-slide")
        expect(slides[1].className).toContain("current-slide")
    })
    it("Moves class 'current-slide' to last object in array when moving left from the start.",()=>{
        const slides = document.querySelectorAll(".image")
        const leftBtn = document.querySelector("#c_left")
        expect(slides[0].className).toContain("current-slide")
        leftBtn.click()
        expect(slides[3].className).toContain("current-slide")
    })
    it("Moves class 'current-slide' to first object in array when moving right from the end.",()=>{
        const slides = document.querySelectorAll(".image")
        const rightBtn = document.querySelector("#c_right")
        slides[3].classList.add("current-slide")
        slides[0].classList.remove("current-slide")

        rightBtn.click()
        expect(slides[3].className).not.toContain("current-slide")
        expect(slides[0].className).toContain("current-slide")
    })
})

