(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { change_page ,left_input,right_input} = require("./navigation")
const {changeTarget,loadAllSuggestions,postSuggestion,loadPostsFromCategory,destroyPosts} = require("./suggestions")

window.addEventListener("resize", () => width = window.innerWidth)

// HOME PAGE
if(window.location.href.includes("index.html")){
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

module.exports = {changeTarget,loadAllSuggestions, postSuggestion,loadPostsFromCategory,destroyPosts}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvaW5kZXguanMiLCJhc3NldHMvbmF2aWdhdGlvbi5qcyIsImFzc2V0cy9zdWdnZXN0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IHsgY2hhbmdlX3BhZ2UgLGxlZnRfaW5wdXQscmlnaHRfaW5wdXR9ID0gcmVxdWlyZShcIi4vbmF2aWdhdGlvblwiKVxyXG5jb25zdCB7Y2hhbmdlVGFyZ2V0LGxvYWRBbGxTdWdnZXN0aW9ucyxwb3N0U3VnZ2VzdGlvbixsb2FkUG9zdHNGcm9tQ2F0ZWdvcnksZGVzdHJveVBvc3RzfSA9IHJlcXVpcmUoXCIuL3N1Z2dlc3Rpb25zXCIpXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoKVxyXG5cclxuLy8gSE9NRSBQQUdFXHJcbmlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiaW5kZXguaHRtbFwiKSl7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNfcmlnaHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHJpZ2h0X2lucHV0KCkpXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNfbGVmdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gbGVmdF9pbnB1dCgpKVxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2dpbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiBjaGFuZ2VfcGFnZShcImxvZ2luXCIpKVxyXG59XHJcblxyXG5cclxuXHJcbi8vIFNVR0dFU1RJT05TIFBBR0VcclxuaWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJzdWdnZXN0aW9ucy5odG1sXCIpKXtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKS5mb3JFYWNoKGNhcmQgPT4gY2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGRlc3Ryb3lQb3N0cygpXHJcbiAgICAgICAgY2hhbmdlVGFyZ2V0KGNhcmQpO1xyXG4gICAgICAgIGxvYWRQb3N0c0Zyb21DYXRlZ29yeSgpO1xyXG59KSlcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBhc3luYyAoKT0+IGxvYWRBbGxTdWdnZXN0aW9ucygpKVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3N0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIixwb3N0U3VnZ2VzdGlvbilcclxufSIsImZ1bmN0aW9uIGNoYW5nZV9wYWdlKHBhZ2Upe1xyXG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgJHtwYWdlfS5odG1sYDtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ2xhc3NlcyhjdXJyLG5leHQpe1xyXG4gICAgY3Vyci5jbGFzc0xpc3QucmVtb3ZlKFwiY3VycmVudC1zbGlkZVwiKVxyXG4gICAgbmV4dC5jbGFzc0xpc3QuYWRkKFwiY3VycmVudC1zbGlkZVwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiBsZWZ0X2lucHV0KCl7XHJcbiAgICBjb25zdCBpbWdXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbWctd3JhcHBlclwiKTtcclxuICAgIGNvbnN0IHNsaWRlcyA9IEFycmF5LmZyb20oaW1nV3JhcHBlci5jaGlsZHJlbik7XHJcbiAgICBjb25zdCBjdXJyZW50U2xpZGUgPSBpbWdXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudC1zbGlkZVwiKVxyXG4gICAgY29uc3QgY3VycmVudFNsaWRlSW5kZXggPSBzbGlkZXMuaW5kZXhPZihjdXJyZW50U2xpZGUpXHJcbiAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHJcbiAgICBsZXQgbmV4dFNsaWRlID0gY3VycmVudFNsaWRlLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgaWYoY3VycmVudFNsaWRlSW5kZXggPT0gMCl7XHJcbiAgICAgICAgbmV4dFNsaWRlID0gc2xpZGVzWzNdXHJcbiAgICAgICAgaW1nV3JhcHBlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgkey13aWR0aCozfXB4KWBcclxuICAgICAgICBcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGltZ1dyYXBwZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHstd2lkdGgqKGN1cnJlbnRTbGlkZUluZGV4LTEpfXB4KWBcclxuICAgIH1cclxuICAgIGN1cnJlbnRTbGlkZS5jbGFzc0xpc3QucmVtb3ZlKFwiY3VycmVudC1zbGlkZVwiKVxyXG4gICAgbmV4dFNsaWRlLmNsYXNzTGlzdC5hZGQoXCJjdXJyZW50LXNsaWRlXCIpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJpZ2h0X2lucHV0KCl7XHJcbiAgICBjb25zdCBpbWdXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbWctd3JhcHBlclwiKTtcclxuICAgIGNvbnN0IHNsaWRlcyA9IEFycmF5LmZyb20oaW1nV3JhcHBlci5jaGlsZHJlbik7XHJcbiAgICBjb25zdCBjdXJyZW50U2xpZGUgPSBpbWdXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudC1zbGlkZVwiKVxyXG4gICAgY29uc3QgY3VycmVudFNsaWRlSW5kZXggPSBzbGlkZXMuaW5kZXhPZihjdXJyZW50U2xpZGUpXHJcbiAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHJcbiAgICBsZXQgbmV4dFNsaWRlID0gY3VycmVudFNsaWRlLm5leHRFbGVtZW50U2libGluZztcclxuXHJcbiAgICBpZihjdXJyZW50U2xpZGVJbmRleCsxID09PSBzbGlkZXMubGVuZ3RoKXtcclxuICAgICAgICBuZXh0U2xpZGUgPSBzbGlkZXNbMF1cclxuICAgICAgICBpbWdXcmFwcGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKC0ke3dpZHRoKjB9cHgpYFxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgaW1nV3JhcHBlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgtJHt3aWR0aCooY3VycmVudFNsaWRlSW5kZXgrMSl9cHgpYFxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNsYXNzZXMoY3VycmVudFNsaWRlLG5leHRTbGlkZSlcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7Y2hhbmdlX3BhZ2UsbGVmdF9pbnB1dCxyaWdodF9pbnB1dH0iLCJmdW5jdGlvbiBjaGFuZ2VUYXJnZXQoY2FyZCl7XHJcbiAgICBjb25zdCBvbGRDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXJnZXRcIik7XHJcblxyXG4gICAgaWYob2xkQ2FyZCA9PT0gbnVsbCl7XHJcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKFwidGFyZ2V0XCIpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBvbGRDYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJ0YXJnZXRcIilcclxuICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoXCJ0YXJnZXRcIilcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUG9zdChpZCx0aXRsZSxjYXRlZ29yeSxkZXNjKXtcclxuICAgIGNvbnN0IHBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuICAgIHBhcmVudC5jbGFzc0xpc3QuYWRkKFwicG9zdFwiKVxyXG4gICAgcGFyZW50LnNldEF0dHJpYnV0ZShcImlkXCIsYHBvc3Qke2lkfWApXHJcblxyXG4gICAgY29uc3QgdGl0bGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcbiAgICB0aXRsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwidGl0bGVDb250YWluZXJcIilcclxuXHJcbiAgICBjb25zdCB0aXRsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg1XCIpXHJcbiAgICB0aXRsZUVsLnRleHRDb250ZW50ID0gdGl0bGVcclxuICAgIHRpdGxlQ29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlRWwpXHJcblxyXG4gICAgY29uc3QgY2F0ZWdvcnlFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNlwiKVxyXG4gICAgY2F0ZWdvcnlFbC50ZXh0Q29udGVudCA9IFwiLVwiK2NhdGVnb3J5XHJcbiAgICB0aXRsZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjYXRlZ29yeUVsKSBcclxuXHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGl0bGVDb250YWluZXIpXHJcblxyXG4gICAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpXHJcbiAgICBjb250ZW50LnRleHRDb250ZW50ID0gZGVzY1xyXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKGNvbnRlbnQpXHJcblxyXG4gICAgcmV0dXJuIHBhcmVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzb2x2ZUNhdGVnb3J5KGNhdCl7XHJcbiAgICBpZihjYXQgPT09IFwicHVibGljc2VydmljZXNcIil7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9ZWxzZSBpZihjYXQgPT09IFwicmVjeWNsaW5nXCIpe1xyXG4gICAgICAgIHJldHVybiAyO1xyXG4gICAgfWVsc2UgaWYoY2F0ID09PSBcImxhbmRzY2FwZVwiKXtcclxuICAgICAgICByZXR1cm4gMztcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHJldHVybiA0O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZXN0cm95UG9zdHMoKXtcclxuICAgIGNvbnN0IHBvc3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBvc3RcIilcclxuICAgIGlmKHBvc3RzLmxlbmd0aCA+IDApe1xyXG4gICAgICAgIHdoaWxlKHBvc3RzLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBwb3N0c1swXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBvc3RzWzBdKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8gR0VUIEFMTCBTVUdHRVNUSU9OU1xyXG5hc3luYyBmdW5jdGlvbiBsb2FkQWxsU3VnZ2VzdGlvbnMoKXtcclxuICAgIGNvbnN0IHN1Z2dlc3Rpb25zQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdWdnZXN0aW9uc1wiKVxyXG5cclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvc3VnZ2VzdGlvbnNcIilcclxuICAgIGNvbnN0IHBvc3RzID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcbiAgICBwb3N0cy5mb3JFYWNoKHBvc3QgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5ld1Bvc3QgPSBjcmVhdGVQb3N0KHBvc3QuaWQscG9zdC50aXRsZSxwb3N0LmNhdGVnb3J5X25hbWUscG9zdC5jb250ZW50KVxyXG4gICAgICAgIHN1Z2dlc3Rpb25zQ29udGFpbmVyLmFwcGVuZENoaWxkKG5ld1Bvc3QpXHJcbiAgICB9KVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBsb2FkUG9zdHNGcm9tQ2F0ZWdvcnkoKXtcclxuICAgIFxyXG4gICAgY29uc3Qgc3VnZ0NvbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN1Z2dlc3Rpb25zXCIpXHJcbiAgICBjb25zdCB0b3BpYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFyZ2V0XCIpXHJcbiAgICBjb25zdCBwb3N0SWR4ID0gcmVzb2x2ZUNhdGVnb3J5KHRvcGljLmlkKVxyXG5cclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9jYXRlZ29yaWVzLyR7cG9zdElkeH0vc3VnZ2VzdGlvbnNgKVxyXG4gICAgY29uc3QgcG9zdHMgPSBhd2FpdCByZXNwb25zZS5qc29uKClcclxuXHJcbiAgICBwb3N0cy5mb3JFYWNoKHBvc3QgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5ld1Bvc3QgPSBjcmVhdGVQb3N0KHBvc3QuaWQscG9zdC50aXRsZSxwb3N0LmNhdGVnb3J5X25hbWUscG9zdC5jb250ZW50KVxyXG4gICAgICAgIHN1Z2dDb250LmFwcGVuZENoaWxkKG5ld1Bvc3QpXHJcbiAgICB9KVxyXG5cclxuICAgIFxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBwb3N0U3VnZ2VzdGlvbihlKXtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgIGNvbnN0IHRpdGxlRW50cnkgPSBlLnRhcmdldC50aXRsZS52YWx1ZTtcclxuICAgIGNvbnN0IGNhdGVnb3J5ID0gZS50YXJnZXQuY2F0ZWdvcnkudmFsdWU7XHJcbiAgICBjb25zdCBkZXNjRW50cnkgPSBlLnRhcmdldC5jb250ZW50LnZhbHVlO1xyXG5cclxuICAgIC8vIGNvbnN0IHBvc3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBvc3RcIilcclxuXHJcbiAgICBjb25zdCBjYXRJZHggPSByZXNvbHZlQ2F0ZWdvcnkoY2F0ZWdvcnkpO1xyXG5cclxuICAgIGlmKHRpdGxlRW50cnkudHJpbSgpLmxlbmd0aCA+IDAgJiYgZGVzY0VudHJ5LnRyaW0oKS5sZW5ndGggPjApe1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDpcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczp7XCJDb250ZW50LVR5cGVcIjpcImFwcGxpY2F0aW9uL2pzb25cIn0sXHJcbiAgICAgICAgICAgIGJvZHk6SlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnlfbmFtZTpjYXRlZ29yeSxcclxuICAgICAgICAgICAgICAgIHRpdGxlOnRpdGxlRW50cnksXHJcbiAgICAgICAgICAgICAgICBjb250ZW50OmRlc2NFbnRyeSxcclxuICAgICAgICAgICAgICAgIHVzZXJfaWQ6MVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjMwMDAvY2F0ZWdvcmllcy8ke2NhdElkeH0vc3VnZ2VzdGlvbnNgLG9wdGlvbnMpXHJcbiAgICAgICAgZGVzdHJveVBvc3RzKClcclxuICAgICAgICBsb2FkQWxsU3VnZ2VzdGlvbnMoKVxyXG4gICAgfVxyXG4gICAgZS50YXJnZXQudGl0bGUudmFsdWUgPSBcIlwiO1xyXG4gICAgZS50YXJnZXQuY29udGVudC52YWx1ZSA9IFwiXCI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2NoYW5nZVRhcmdldCxsb2FkQWxsU3VnZ2VzdGlvbnMsIHBvc3RTdWdnZXN0aW9uLGxvYWRQb3N0c0Zyb21DYXRlZ29yeSxkZXN0cm95UG9zdHN9Il19
