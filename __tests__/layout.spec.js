const {renderDOM} = require("./helpers")

let dom;
let document;

describe("index.html", () => {
    beforeEach(async () => {
        dom = await renderDOM("./index.html")
        document = await dom.window.document;
    })
    it("Has a navbar.",()=>{
        const navbar = document.querySelector(".navbar")
        expect(navbar).toBeTruthy()
    })
    it("Left carousel button loops to end of image array where at beginning.",()=> {
        const carouselLeft = document.querySelector("#c_left")
        const lastArrayEl = document.getElementById("skills")
        carouselLeft.click()
        expect(lastArrayEl.className).toContain("current-slide")
    })
    it("Right carousel button loops to start of array when at the end.",()=>{
        const carouselRight = document.querySelector("#c_right")
        const lastArrayEL = document.getElementById("skills")
        const firstArrayEl = document.getElementById("publicservices")
        lastArrayEL.classList.add("current-slide")
        firstArrayEl.classList.remove("current-slide")
        carouselRight.click()
        expect(firstArrayEl.className).toContain("current-slide")
    })
})