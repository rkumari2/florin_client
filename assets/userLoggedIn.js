const checkLoggedIn = async () =>{
    const token = localStorage.getItem("token")
    if(token.length > 0){
        const response = await fetch("http://localhost:3000/users/tokens")
        const respToken = await response.json()
        let user = "";

        for(t in respToken){
            if (respToken[t].token == token){
                user = await getUsername(respToken[t].user_id)
            }
        }
        disableLogin(user)
        createSignOut(user)
    }else{
        console.log("No one is logged in.")
    }
}

const createSignOut = (username) => {
    const usernameEl = document.getElementById("navusername")
    usernameEl.style.display = "flex"
    usernameEl.textContent = `${username}`
    document.getElementById("logout").style.display = "flex"
}

const disableLogin = (username) => {
    if(username){
        document.getElementById("login").style.display = "none"
        document.getElementById("register").style.display = "none"
    }
}

const getUsername = async (user_id) => {
    const response = await fetch(`http://localhost:3000/users`)
    const users = await response.json()
    let username;
    for(u in users){
        if(users[u].id === user_id){
            return users[u].username
        }
    }
}

module.exports = {checkLoggedIn}