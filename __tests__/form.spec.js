const login = require('../assets/login');

let dom;
let document;


describe('login', () => {
    it('Is a string', () => {
        const arg = login.validatePassword('charliePass10')
        expect(arg).toBeTruthy();
    })
    it('Is not just Numbers', () => {
        const arg = login.validatePassword(2)
        expect(arg).toBeFalsy();
    })
    it('Has No Spaces', () => {
        const arg = login.validatePassword('charlie   Pass10')
        expect(arg).toBeFalsy();
    })
    it('Is not all lowercase', () => {
        const arg = login.validatePassword('charlie')
        expect(arg).toBeFalsy();
    })
    it('Is not all uppercase', () => {
        const arg = login.validatePassword('CHARLIE')
        expect(arg).toBeFalsy();
    })
})