const {changeTarget,loadAllSuggestions, postSuggestion,loadPostsFromCategory,destroyPosts} =  require("../assets/suggestions"); 
const {renderDOM} = require("./helpers")



let dom;
let document;

describe("suggestions.html",() => {
    beforeEach(async () => {
        dom = await renderDOM("./suggestions.html")
        document = await dom.window.document;
        fetch.mockClear();
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
    it("Clicking a card will focus it and give it class 'target'.", async ()=>{
        const cards = document.querySelector("#publicservices")
        console.log("!!!!!",cards)
        const publicservices = cards
        publicservices.click()
        expect(publicservices.className).toContain("target")
    })
})

describe("loadAllSuggestions",()=>{
    const MOCK_SUGGESTIONS = {data:[{"id":1,"category_name":"Public Services","title":"Rubbish!","content":"Man it's so bad!","user_id":1},{"id":2,"category_name":"Recycling","title":"Trial Barbara!","content":"Trial Barbara!","user_id":1},{"id":6,"category_name":"Public Services","title":"www","content":"aaa","user_id":1},{"id":7,"category_name":"Landscape","title":"www","content":"aaa","user_id":1},{"id":8,"category_name":"Public Services","title":"Is this thing on?","content":"I dunno man","user_id":1},{"id":9,"category_name":"Recycling","title":"Wowie","content":"I dunno manwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww","user_id":1},{"id":10,"category_name":"Skills","title":"beans","content":"eggs","user_id":1},{"id":11,"category_name":"Skills","title":"www","content":"aaaaaaaa","user_id":1},{"id":12,"category_name":"Recycling","title":"I can add more!","content":"PENIS","user_id":1}]}
    beforeEach(()=>{
        global.fetch = jest.fn().mockResolvedValue({
            json:jest.fn().mockResolvedValue(MOCK_SUGGESTIONS)
        })
    })
    it("Fetches successfully from the API",async ()=>{
        const mockResponse = {data:MOCK_SUGGESTIONS}
    })
})