/**
 * @jest-environment jsdom
 */

const fetch = require("jest-fetch-mock")

global.fetch = fetch

const {loadAllSuggestions} = require("../assets/suggestions")



describe("loadAllSuggestions",()=>{
    beforeEach(()=>{
        fetch.resetMocks()
    })
    test("Makes a fetch request to API.", async ()=>{
        await loadAllSuggestions()
        expect(fetch).toHaveBeenCalled()
    })
})