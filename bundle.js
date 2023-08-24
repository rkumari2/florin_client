(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { change_page ,left_input,right_input} = require("./navigation")
const {changeTarget,resizePosts,loadAllSuggestions,postSuggestion,loadPostsFromCategory,destroyPosts} = require("./suggestions")

window.addEventListener("resize", () => width = window.innerWidth)

// HOME PAGE
if(window.location.href.includes("index.html") || !(location.href.includes("html"))){
    document.getElementById("c_right").addEventListener("click", () => right_input())
    document.getElementById("c_left").addEventListener("click", () => left_input())
    document.querySelector(".loginBtn").addEventListener("click",() => change_page("login"))
}



// SUGGESTIONS PAGE
if(window.location.href.includes("suggestions.html")){
    document.querySelectorAll(".card").forEach(card => card.addEventListener("click", async () => {
        destroyPosts()
        changeTarget(card);
        loadPostsFromCategory();
    }))
    window.addEventListener("load", async ()=> loadAllSuggestions())
    document.getElementById("post").addEventListener("submit",postSuggestion)
    window.addEventListener("resize", () => resizePosts())
}
},{"./navigation":2,"./suggestions":3}],2:[function(require,module,exports){
function change_page(page){
    window.location.href = `${page}.html`;
}

function updateClasses(curr,next){
    curr.classList.remove("current-slide")
    next.classList.add("current-slide")
}

function left_input(){
    const imgWrapper = document.getElementById("img-wrapper");
    const slides = Array.from(imgWrapper.children);
    const currentSlide = imgWrapper.querySelector(".current-slide")
    const currentSlideIndex = slides.indexOf(currentSlide)
    var width = window.innerWidth;

    let nextSlide = currentSlide.previousElementSibling;

    if(currentSlideIndex == 0){
        nextSlide = slides[3]
        imgWrapper.style.transform = `translateX(${-width*3}px)`
        
    }else{
        imgWrapper.style.transform = `translateX(${-width*(currentSlideIndex-1)}px)`
    }
    currentSlide.classList.remove("current-slide")
    nextSlide.classList.add("current-slide")
}

function right_input(){
    const imgWrapper = document.getElementById("img-wrapper");
    const slides = Array.from(imgWrapper.children);
    const currentSlide = imgWrapper.querySelector(".current-slide")
    const currentSlideIndex = slides.indexOf(currentSlide)
    var width = window.innerWidth;

    let nextSlide = currentSlide.nextElementSibling;

    if(currentSlideIndex+1 === slides.length){
        nextSlide = slides[0]
        imgWrapper.style.transform = `translateX(-${width*0}px)`
    }else{
        imgWrapper.style.transform = `translateX(-${width*(currentSlideIndex+1)}px)`
    }

    updateClasses(currentSlide,nextSlide)
}

module.exports = {change_page,left_input,right_input}
},{}],3:[function(require,module,exports){
function changeTarget(card){
    const oldCard = document.querySelector(".target");

    if(oldCard === null){
        card.classList.add("target")
    }else{
        oldCard.classList.remove("target")
        card.classList.add("target")
    }
}

function resizePosts(){
    const postContainer = document.querySelector(".suggestions")
    postContainer.computedStyleMap.height = "90%"
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

function destroyPosts(){
    const posts = document.getElementsByClassName("post")
    if(posts.length > 0){
        while(posts.length > 0){
            posts[0].parentNode.removeChild(posts[0])
        }
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

async function loadPostsFromCategory(){
    
    const suggCont = document.querySelector(".suggestions")
    const topic = document.querySelector(".target")
    const postIdx = resolveCategory(topic.id)

    const response = await fetch(`http://localhost:3000/categories/${postIdx}/suggestions`)
    const posts = await response.json()

    posts.forEach(post => {
        const newPost = createPost(post.id,post.title,post.category_name,post.content)
        suggCont.appendChild(newPost)
    })

    
}

async function postSuggestion(e){
    e.preventDefault()

    const titleEntry = e.target.title.value;
    const category = e.target.category.value;
    const descEntry = e.target.content.value;

    // const posts = document.getElementsByClassName("post")

    const catIdx = resolveCategory(category);

    if(titleEntry.trim().length > 0 && descEntry.trim().length >0){
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
        destroyPosts()
        loadAllSuggestions()
    }
    e.target.title.value = "";
    e.target.content.value = "";
}

module.exports = {changeTarget,resizePosts,loadAllSuggestions, postSuggestion,loadPostsFromCategory,destroyPosts}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvaW5kZXguanMiLCJhc3NldHMvbmF2aWdhdGlvbi5qcyIsImFzc2V0cy9zdWdnZXN0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IHsgY2hhbmdlX3BhZ2UgLGxlZnRfaW5wdXQscmlnaHRfaW5wdXR9ID0gcmVxdWlyZShcIi4vbmF2aWdhdGlvblwiKVxyXG5jb25zdCB7Y2hhbmdlVGFyZ2V0LHJlc2l6ZVBvc3RzLGxvYWRBbGxTdWdnZXN0aW9ucyxwb3N0U3VnZ2VzdGlvbixsb2FkUG9zdHNGcm9tQ2F0ZWdvcnksZGVzdHJveVBvc3RzfSA9IHJlcXVpcmUoXCIuL3N1Z2dlc3Rpb25zXCIpXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoKVxyXG5cclxuLy8gSE9NRSBQQUdFXHJcbmlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiaW5kZXguaHRtbFwiKSB8fCAhKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJodG1sXCIpKSl7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNfcmlnaHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHJpZ2h0X2lucHV0KCkpXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNfbGVmdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gbGVmdF9pbnB1dCgpKVxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2dpbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiBjaGFuZ2VfcGFnZShcImxvZ2luXCIpKVxyXG59XHJcblxyXG5cclxuXHJcbi8vIFNVR0dFU1RJT05TIFBBR0VcclxuaWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJzdWdnZXN0aW9ucy5odG1sXCIpKXtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKS5mb3JFYWNoKGNhcmQgPT4gY2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGRlc3Ryb3lQb3N0cygpXHJcbiAgICAgICAgY2hhbmdlVGFyZ2V0KGNhcmQpO1xyXG4gICAgICAgIGxvYWRQb3N0c0Zyb21DYXRlZ29yeSgpO1xyXG4gICAgfSkpXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgYXN5bmMgKCk9PiBsb2FkQWxsU3VnZ2VzdGlvbnMoKSlcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zdFwiKS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIscG9zdFN1Z2dlc3Rpb24pXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiByZXNpemVQb3N0cygpKVxyXG59IiwiZnVuY3Rpb24gY2hhbmdlX3BhZ2UocGFnZSl7XHJcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAke3BhZ2V9Lmh0bWxgO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDbGFzc2VzKGN1cnIsbmV4dCl7XHJcbiAgICBjdXJyLmNsYXNzTGlzdC5yZW1vdmUoXCJjdXJyZW50LXNsaWRlXCIpXHJcbiAgICBuZXh0LmNsYXNzTGlzdC5hZGQoXCJjdXJyZW50LXNsaWRlXCIpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxlZnRfaW5wdXQoKXtcclxuICAgIGNvbnN0IGltZ1dyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImltZy13cmFwcGVyXCIpO1xyXG4gICAgY29uc3Qgc2xpZGVzID0gQXJyYXkuZnJvbShpbWdXcmFwcGVyLmNoaWxkcmVuKTtcclxuICAgIGNvbnN0IGN1cnJlbnRTbGlkZSA9IGltZ1dyYXBwZXIucXVlcnlTZWxlY3RvcihcIi5jdXJyZW50LXNsaWRlXCIpXHJcbiAgICBjb25zdCBjdXJyZW50U2xpZGVJbmRleCA9IHNsaWRlcy5pbmRleE9mKGN1cnJlbnRTbGlkZSlcclxuICAgIHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG5cclxuICAgIGxldCBuZXh0U2xpZGUgPSBjdXJyZW50U2xpZGUucHJldmlvdXNFbGVtZW50U2libGluZztcclxuXHJcbiAgICBpZihjdXJyZW50U2xpZGVJbmRleCA9PSAwKXtcclxuICAgICAgICBuZXh0U2xpZGUgPSBzbGlkZXNbM11cclxuICAgICAgICBpbWdXcmFwcGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7LXdpZHRoKjN9cHgpYFxyXG4gICAgICAgIFxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgaW1nV3JhcHBlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgkey13aWR0aCooY3VycmVudFNsaWRlSW5kZXgtMSl9cHgpYFxyXG4gICAgfVxyXG4gICAgY3VycmVudFNsaWRlLmNsYXNzTGlzdC5yZW1vdmUoXCJjdXJyZW50LXNsaWRlXCIpXHJcbiAgICBuZXh0U2xpZGUuY2xhc3NMaXN0LmFkZChcImN1cnJlbnQtc2xpZGVcIilcclxufVxyXG5cclxuZnVuY3Rpb24gcmlnaHRfaW5wdXQoKXtcclxuICAgIGNvbnN0IGltZ1dyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImltZy13cmFwcGVyXCIpO1xyXG4gICAgY29uc3Qgc2xpZGVzID0gQXJyYXkuZnJvbShpbWdXcmFwcGVyLmNoaWxkcmVuKTtcclxuICAgIGNvbnN0IGN1cnJlbnRTbGlkZSA9IGltZ1dyYXBwZXIucXVlcnlTZWxlY3RvcihcIi5jdXJyZW50LXNsaWRlXCIpXHJcbiAgICBjb25zdCBjdXJyZW50U2xpZGVJbmRleCA9IHNsaWRlcy5pbmRleE9mKGN1cnJlbnRTbGlkZSlcclxuICAgIHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG5cclxuICAgIGxldCBuZXh0U2xpZGUgPSBjdXJyZW50U2xpZGUubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG5cclxuICAgIGlmKGN1cnJlbnRTbGlkZUluZGV4KzEgPT09IHNsaWRlcy5sZW5ndGgpe1xyXG4gICAgICAgIG5leHRTbGlkZSA9IHNsaWRlc1swXVxyXG4gICAgICAgIGltZ1dyYXBwZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoLSR7d2lkdGgqMH1weClgXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBpbWdXcmFwcGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKC0ke3dpZHRoKihjdXJyZW50U2xpZGVJbmRleCsxKX1weClgXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQ2xhc3NlcyhjdXJyZW50U2xpZGUsbmV4dFNsaWRlKVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtjaGFuZ2VfcGFnZSxsZWZ0X2lucHV0LHJpZ2h0X2lucHV0fSIsImZ1bmN0aW9uIGNoYW5nZVRhcmdldChjYXJkKXtcclxuICAgIGNvbnN0IG9sZENhcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRhcmdldFwiKTtcclxuXHJcbiAgICBpZihvbGRDYXJkID09PSBudWxsKXtcclxuICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoXCJ0YXJnZXRcIilcclxuICAgIH1lbHNle1xyXG4gICAgICAgIG9sZENhcmQuY2xhc3NMaXN0LnJlbW92ZShcInRhcmdldFwiKVxyXG4gICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZChcInRhcmdldFwiKVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZXNpemVQb3N0cygpe1xyXG4gICAgY29uc3QgcG9zdENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VnZ2VzdGlvbnNcIilcclxuICAgIHBvc3RDb250YWluZXIuY29tcHV0ZWRTdHlsZU1hcC5oZWlnaHQgPSBcIjkwJVwiXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBvc3QoaWQsdGl0bGUsY2F0ZWdvcnksZGVzYyl7XHJcbiAgICBjb25zdCBwYXJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcbiAgICBwYXJlbnQuY2xhc3NMaXN0LmFkZChcInBvc3RcIilcclxuICAgIHBhcmVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLGBwb3N0JHtpZH1gKVxyXG5cclxuICAgIGNvbnN0IHRpdGxlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgdGl0bGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInRpdGxlQ29udGFpbmVyXCIpXHJcblxyXG4gICAgY29uc3QgdGl0bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNVwiKVxyXG4gICAgdGl0bGVFbC50ZXh0Q29udGVudCA9IHRpdGxlXHJcbiAgICB0aXRsZUNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZUVsKVxyXG5cclxuICAgIGNvbnN0IGNhdGVnb3J5RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDZcIilcclxuICAgIGNhdGVnb3J5RWwudGV4dENvbnRlbnQgPSBcIi1cIitjYXRlZ29yeVxyXG4gICAgdGl0bGVDb250YWluZXIuYXBwZW5kQ2hpbGQoY2F0ZWdvcnlFbCkgXHJcblxyXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRpdGxlQ29udGFpbmVyKVxyXG5cclxuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKVxyXG4gICAgY29udGVudC50ZXh0Q29udGVudCA9IGRlc2NcclxuICAgIHBhcmVudC5hcHBlbmRDaGlsZChjb250ZW50KVxyXG5cclxuICAgIHJldHVybiBwYXJlbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc29sdmVDYXRlZ29yeShjYXQpe1xyXG4gICAgaWYoY2F0ID09PSBcInB1YmxpY3NlcnZpY2VzXCIpe1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgfWVsc2UgaWYoY2F0ID09PSBcInJlY3ljbGluZ1wiKXtcclxuICAgICAgICByZXR1cm4gMjtcclxuICAgIH1lbHNlIGlmKGNhdCA9PT0gXCJsYW5kc2NhcGVcIil7XHJcbiAgICAgICAgcmV0dXJuIDM7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICByZXR1cm4gNDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVzdHJveVBvc3RzKCl7XHJcbiAgICBjb25zdCBwb3N0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwb3N0XCIpXHJcbiAgICBpZihwb3N0cy5sZW5ndGggPiAwKXtcclxuICAgICAgICB3aGlsZShwb3N0cy5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgcG9zdHNbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwb3N0c1swXSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIEdFVCBBTEwgU1VHR0VTVElPTlNcclxuYXN5bmMgZnVuY3Rpb24gbG9hZEFsbFN1Z2dlc3Rpb25zKCl7XHJcbiAgICBjb25zdCBzdWdnZXN0aW9uc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VnZ2VzdGlvbnNcIilcclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL3N1Z2dlc3Rpb25zXCIpXHJcbiAgICBjb25zdCBwb3N0cyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgcG9zdHMuZm9yRWFjaChwb3N0ID0+IHtcclxuICAgICAgICBjb25zdCBuZXdQb3N0ID0gY3JlYXRlUG9zdChwb3N0LmlkLHBvc3QudGl0bGUscG9zdC5jYXRlZ29yeV9uYW1lLHBvc3QuY29udGVudClcclxuICAgICAgICBzdWdnZXN0aW9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChuZXdQb3N0KVxyXG4gICAgfSlcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gbG9hZFBvc3RzRnJvbUNhdGVnb3J5KCl7XHJcbiAgICBcclxuICAgIGNvbnN0IHN1Z2dDb250ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdWdnZXN0aW9uc1wiKVxyXG4gICAgY29uc3QgdG9waWMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRhcmdldFwiKVxyXG4gICAgY29uc3QgcG9zdElkeCA9IHJlc29sdmVDYXRlZ29yeSh0b3BpYy5pZClcclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjMwMDAvY2F0ZWdvcmllcy8ke3Bvc3RJZHh9L3N1Z2dlc3Rpb25zYClcclxuICAgIGNvbnN0IHBvc3RzID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcblxyXG4gICAgcG9zdHMuZm9yRWFjaChwb3N0ID0+IHtcclxuICAgICAgICBjb25zdCBuZXdQb3N0ID0gY3JlYXRlUG9zdChwb3N0LmlkLHBvc3QudGl0bGUscG9zdC5jYXRlZ29yeV9uYW1lLHBvc3QuY29udGVudClcclxuICAgICAgICBzdWdnQ29udC5hcHBlbmRDaGlsZChuZXdQb3N0KVxyXG4gICAgfSlcclxuXHJcbiAgICBcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gcG9zdFN1Z2dlc3Rpb24oZSl7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICBjb25zdCB0aXRsZUVudHJ5ID0gZS50YXJnZXQudGl0bGUudmFsdWU7XHJcbiAgICBjb25zdCBjYXRlZ29yeSA9IGUudGFyZ2V0LmNhdGVnb3J5LnZhbHVlO1xyXG4gICAgY29uc3QgZGVzY0VudHJ5ID0gZS50YXJnZXQuY29udGVudC52YWx1ZTtcclxuXHJcbiAgICAvLyBjb25zdCBwb3N0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwb3N0XCIpXHJcblxyXG4gICAgY29uc3QgY2F0SWR4ID0gcmVzb2x2ZUNhdGVnb3J5KGNhdGVnb3J5KTtcclxuXHJcbiAgICBpZih0aXRsZUVudHJ5LnRyaW0oKS5sZW5ndGggPiAwICYmIGRlc2NFbnRyeS50cmltKCkubGVuZ3RoID4wKXtcclxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6XCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6e1wiQ29udGVudC1UeXBlXCI6XCJhcHBsaWNhdGlvbi9qc29uXCJ9LFxyXG4gICAgICAgICAgICBib2R5OkpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5X25hbWU6Y2F0ZWdvcnksXHJcbiAgICAgICAgICAgICAgICB0aXRsZTp0aXRsZUVudHJ5LFxyXG4gICAgICAgICAgICAgICAgY29udGVudDpkZXNjRW50cnksXHJcbiAgICAgICAgICAgICAgICB1c2VyX2lkOjFcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDozMDAwL2NhdGVnb3JpZXMvJHtjYXRJZHh9L3N1Z2dlc3Rpb25zYCxvcHRpb25zKVxyXG4gICAgICAgIGRlc3Ryb3lQb3N0cygpXHJcbiAgICAgICAgbG9hZEFsbFN1Z2dlc3Rpb25zKClcclxuICAgIH1cclxuICAgIGUudGFyZ2V0LnRpdGxlLnZhbHVlID0gXCJcIjtcclxuICAgIGUudGFyZ2V0LmNvbnRlbnQudmFsdWUgPSBcIlwiO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtjaGFuZ2VUYXJnZXQscmVzaXplUG9zdHMsbG9hZEFsbFN1Z2dlc3Rpb25zLCBwb3N0U3VnZ2VzdGlvbixsb2FkUG9zdHNGcm9tQ2F0ZWdvcnksZGVzdHJveVBvc3RzfSJdfQ==
