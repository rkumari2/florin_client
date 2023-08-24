const checkLoggedIn = async () =>{
    let token = ""
    try {
        token = sessionStorage.getItem("token")
    } catch (err) {
        console.log(err.message)
    }
    
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
    if(username){
        usernameEl.style.display = "flex"
        usernameEl.textContent = `${username}`
        document.getElementById("logout").style.display = "flex"
    }else{
        usernameEl.style.display = "none"
        usernameEl.textContent = ""
        document.getElementById("logout").style.display = "none"
    }
    
}

const disableLogin = (username) => {
    if(username){
        document.getElementById("login").style.display = "none"
        document.getElementById("register").style.display = "none"
    }else{
        document.getElementById("login").style.display = "flex"
        document.getElementById("register").style.display = "flex"
    }
}

const getUsername = async (user_id) => {
    const response = await fetch(`https://florin-server-ijt6.onrender.com/users`)
    const users = await response.json()
    let username;
    for(u in users){
        if(users[u].id === user_id){
            return users[u].username
        }
    }
}

const getUser = async (user_id) => {
    const response = await fetch(`https://florin-server-ijt6.onrender.com/users`)
    const users = await response.json()
    let username;
    for(u in users){
        if(users[u].id === user_id){
            return users[u]
        }
    }
}

const logOut = async () => {
    localToken = sessionStorage.getItem("token")

    let user;

    const response = await fetch("https://florin-server-ijt6.onrender.com/users/tokens")
    const respToken = await response.json()
    for(t in respToken){
        if (respToken[t].token == localToken){
            user = await getUser(respToken[t].user_id)
        }
    }
    sessionStorage.removeItem("token");
    deleteCurrentUser(user)
    createSignOut()
    disableLogin()
}

const deleteCurrentUser = async (user) => {
    const options = {
        method:"DELETE",
        headers:{"Content-Type":"application/json"},
        body:null
    }
    const response = await fetch(`https://florin-server-ijt6.onrender.com/users/tokens/${user.id}`,options)
}

const checkIfGuest = () => {
    if(!(sessionStorage.getItem("token"))){
        document.getElementById("post").style.display = "none";
    }
}

module.exports = {checkLoggedIn,logOut,checkIfGuest}