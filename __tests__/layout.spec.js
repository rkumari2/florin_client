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
    

    it("Left carousel button sets current image to end of list item when at start.", ()=>{
        const navLeft = document.querySelector("#c_left")
        const start = document.querySelector("#publicservices")
        navLeft.dispatchEvent(new dom.window.Event("click"))

        const endElement = document.querySelector("#skills")

        expect(endElement.className).toContain("current-slide")
    })
    // it("Right carousel button sets current image to start of carousel when at the end.", ()=>{
    //     const navRight = document.querySelector("#c_right")
    //     const start = document.querySelector("#skills")
    //     navRight.dispatchEvent(new dom.window.Event("click"))

    //     const endElement = document.querySelector(".current-slide")

    //     expect(endElement.className).toContain("current-slide")
    // })
})