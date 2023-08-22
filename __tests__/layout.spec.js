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

})