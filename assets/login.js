

// const submitButton = document.getElementById('login-button')
// const userField = document.getElementById('username-input')
// const passField = document.getElementById('password-input')




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