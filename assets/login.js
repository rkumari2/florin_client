const submitButton = document.getElementById('login-button')


document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const uIsValid = validateUsername(form.get("username"));
    const pIsValid = validatePassword(form.get("password"));

    if(!uIsValid || !pIsValid) {
        alert('Invalid Username or Password.')
        return;
    }

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: form.get("username"),
            password: form.get("password")
        })
    }

    console.log(options);

    const response = await fetch("https://florin-server-ijt6.onrender.com/users/login", options);
    const data = await response.json();

    if (response.status == 200) {
        sessionStorage.setItem("token", data.token);
        console.log(data.token) // to check 
        window.location.assign("suggestions.html");
    } else {
        alert(data.error);
    }
})



// submitButton.addEventListener('click', () => {
//     handleLogin();
// })

const hasWhiteSpace = (userName) => {
    return userName.indexOf(' ') >= 0;
}

const isLowerCase = (input) => {  
    return input === String(input).toLowerCase()
}

const isUpperCase = (input) => {  
    return input === String(input).toUpperCase()
}


const validateUsername = (userName) => {
    if(typeof userName != 'string'){
        return false;
    }
    
    if(hasWhiteSpace(userName)){
        return false;
    }

    if(isUpperCase(userName)){
        return false;
    }

    return true;
}

const validatePassword = (password) => {
    if(typeof password != 'string'){
        return false;
    }
    
    if(hasWhiteSpace(password)){
        return false;
    }

    if(isUpperCase(password)){
        return false;
    }


    return true;
} 


module.exports = {
    validatePassword,
    validateUsername
}
