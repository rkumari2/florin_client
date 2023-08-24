document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const username = form.get("username"); 
    const password = form.get("password")

    if (!username || !password) {
        alert("Cannot register without username or password")
        return; 
    }

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username, 
            password: password
        })
    }

    const response = await fetch("http://localhost:3000/users/register", options);
    const data = await response.json();

    if (response.status == 201) {
        window.location.assign('login.html')
    } else {
        alert(data.error);
    }
})
