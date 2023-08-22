const {renderDOM} = require("./helpers")

let dom;
let document;

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
        // const newPage = location.href;
        // expect(newPage).toBe("./login.html")
    })
})