

const submitButton = document.getElementById('login-button')
const userField = document.getElementById('username-input')
const passField = document.getElementById('password-input')

document.getElementById("form_section").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

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

    console.log(options.body.username, options.body.password);

    const response = await fetch("insert URL", options);
    const data = await response.json();

    if (response.status == 200) {
        localStorage.setItem("token", data.token);
        console.log(data.token) // to check 
        window.location.assign("suggestions.html");
    } else {
        alert(data.error);
    }
})



submitButton.addEventListener('click', () => {
    handleLogin();
})

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
    
    if(isLowerCase(userName)){
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

    if(isLowerCase(password)){
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