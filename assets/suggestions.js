function changeTarget(card){
    const oldCard = document.querySelector(".target");
    oldCard.classList.remove("target")
    card.classList.add("target")
}

function createPost(id,title,category,desc){
    const parent = document.createElement("div")
    parent.classList.add("post")
    parent.setAttribute("id",`post${id}`)

    const titleContainer = document.createElement("div")
    titleContainer.classList.add("titleContainer")

    const titleEl = document.createElement("h5")
    titleEl.textContent = title
    titleContainer.appendChild(titleEl)

    const categoryEl = document.createElement("h6")
    categoryEl.textContent = "-"+category
    titleContainer.appendChild(categoryEl) 

    parent.appendChild(titleContainer)

    const content = document.createElement("p")
    content.textContent = desc
    parent.appendChild(content)

    return parent;
}

function resolveCategory(cat){
    if(cat === "publicservices"){
        return 1;
    }else if(cat === "recycling"){
        return 2;
    }else if(cat === "landscape"){
        return 3;
    }else{
        return 4;
    }
}

// GET ALL SUGGESTIONS
async function loadAllSuggestions(){
    const suggestionsContainer = document.querySelector(".suggestions")

    const response = await fetch("http://localhost:3000/suggestions")
    const posts = await response.json()
    posts.forEach(post => {
        const newPost = createPost(post.id,post.title,post.category_name,post.content)
        suggestionsContainer.appendChild(newPost)
    })
}

async function postSuggestion(e){
    e.preventDefault()

    const titleEntry = e.target.title.value;
    const category = e.target.category.value;
    const descEntry = e.target.content.value;

    console.log(category)

    const posts = document.getElementsByClassName("post")

    const catIdx = resolveCategory(category);

    const options = {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            category_name:category,
            title:titleEntry,
            content:descEntry,
            user_id:1
        })
    }
    const response = await fetch(`http://localhost:3000/categories/${catIdx}/suggestions`,options)
    if(posts.length > 0){
        while(posts.length > 0){
            posts[0].parentNode.removeChild(posts[0])
        }
    }
    loadAllSuggestions()
}

module.exports = {changeTarget,loadAllSuggestions, postSuggestion}