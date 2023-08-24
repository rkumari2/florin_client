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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvaW5kZXguanMiLCJhc3NldHMvbmF2aWdhdGlvbi5qcyIsImFzc2V0cy9zdWdnZXN0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IHsgY2hhbmdlX3BhZ2UgLGxlZnRfaW5wdXQscmlnaHRfaW5wdXR9ID0gcmVxdWlyZShcIi4vbmF2aWdhdGlvblwiKVxuY29uc3Qge2NoYW5nZVRhcmdldCxsb2FkQWxsU3VnZ2VzdGlvbnMscG9zdFN1Z2dlc3Rpb24sbG9hZFBvc3RzRnJvbUNhdGVnb3J5LGRlc3Ryb3lQb3N0c30gPSByZXF1aXJlKFwiLi9zdWdnZXN0aW9uc1wiKVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoKVxuXG4vLyBIT01FIFBBR0VcbmlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiaW5kZXguaHRtbFwiKSl7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjX3JpZ2h0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiByaWdodF9pbnB1dCgpKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY19sZWZ0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBsZWZ0X2lucHV0KCkpXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2dpbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiBjaGFuZ2VfcGFnZShcImxvZ2luXCIpKVxufVxuXG5cblxuLy8gU1VHR0VTVElPTlMgUEFHRVxuaWYod2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJzdWdnZXN0aW9ucy5odG1sXCIpKXtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIikuZm9yRWFjaChjYXJkID0+IGNhcmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgZGVzdHJveVBvc3RzKClcbiAgICAgICAgY2hhbmdlVGFyZ2V0KGNhcmQpO1xuICAgICAgICBsb2FkUG9zdHNGcm9tQ2F0ZWdvcnkoKTtcbn0pKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBhc3luYyAoKT0+IGxvYWRBbGxTdWdnZXN0aW9ucygpKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zdFwiKS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIscG9zdFN1Z2dlc3Rpb24pXG59IiwiZnVuY3Rpb24gY2hhbmdlX3BhZ2UocGFnZSl7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgJHtwYWdlfS5odG1sYDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQ2xhc3NlcyhjdXJyLG5leHQpe1xuICAgIGN1cnIuY2xhc3NMaXN0LnJlbW92ZShcImN1cnJlbnQtc2xpZGVcIilcbiAgICBuZXh0LmNsYXNzTGlzdC5hZGQoXCJjdXJyZW50LXNsaWRlXCIpXG59XG5cbmZ1bmN0aW9uIGxlZnRfaW5wdXQoKXtcbiAgICBjb25zdCBpbWdXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbWctd3JhcHBlclwiKTtcbiAgICBjb25zdCBzbGlkZXMgPSBBcnJheS5mcm9tKGltZ1dyYXBwZXIuY2hpbGRyZW4pO1xuICAgIGNvbnN0IGN1cnJlbnRTbGlkZSA9IGltZ1dyYXBwZXIucXVlcnlTZWxlY3RvcihcIi5jdXJyZW50LXNsaWRlXCIpXG4gICAgY29uc3QgY3VycmVudFNsaWRlSW5kZXggPSBzbGlkZXMuaW5kZXhPZihjdXJyZW50U2xpZGUpXG4gICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cbiAgICBsZXQgbmV4dFNsaWRlID0gY3VycmVudFNsaWRlLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cbiAgICBpZihjdXJyZW50U2xpZGVJbmRleCA9PSAwKXtcbiAgICAgICAgbmV4dFNsaWRlID0gc2xpZGVzWzNdXG4gICAgICAgIGltZ1dyYXBwZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHstd2lkdGgqM31weClgXG4gICAgICAgIFxuICAgIH1lbHNle1xuICAgICAgICBpbWdXcmFwcGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7LXdpZHRoKihjdXJyZW50U2xpZGVJbmRleC0xKX1weClgXG4gICAgfVxuICAgIGN1cnJlbnRTbGlkZS5jbGFzc0xpc3QucmVtb3ZlKFwiY3VycmVudC1zbGlkZVwiKVxuICAgIG5leHRTbGlkZS5jbGFzc0xpc3QuYWRkKFwiY3VycmVudC1zbGlkZVwiKVxufVxuXG5mdW5jdGlvbiByaWdodF9pbnB1dCgpe1xuICAgIGNvbnN0IGltZ1dyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImltZy13cmFwcGVyXCIpO1xuICAgIGNvbnN0IHNsaWRlcyA9IEFycmF5LmZyb20oaW1nV3JhcHBlci5jaGlsZHJlbik7XG4gICAgY29uc3QgY3VycmVudFNsaWRlID0gaW1nV3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnQtc2xpZGVcIilcbiAgICBjb25zdCBjdXJyZW50U2xpZGVJbmRleCA9IHNsaWRlcy5pbmRleE9mKGN1cnJlbnRTbGlkZSlcbiAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblxuICAgIGxldCBuZXh0U2xpZGUgPSBjdXJyZW50U2xpZGUubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG4gICAgaWYoY3VycmVudFNsaWRlSW5kZXgrMSA9PT0gc2xpZGVzLmxlbmd0aCl7XG4gICAgICAgIG5leHRTbGlkZSA9IHNsaWRlc1swXVxuICAgICAgICBpbWdXcmFwcGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKC0ke3dpZHRoKjB9cHgpYFxuICAgIH1lbHNle1xuICAgICAgICBpbWdXcmFwcGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKC0ke3dpZHRoKihjdXJyZW50U2xpZGVJbmRleCsxKX1weClgXG4gICAgfVxuXG4gICAgdXBkYXRlQ2xhc3NlcyhjdXJyZW50U2xpZGUsbmV4dFNsaWRlKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtjaGFuZ2VfcGFnZSxsZWZ0X2lucHV0LHJpZ2h0X2lucHV0fSIsImZ1bmN0aW9uIGNoYW5nZVRhcmdldChjYXJkKXtcbiAgICBjb25zdCBvbGRDYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXJnZXRcIik7XG5cbiAgICBpZihvbGRDYXJkID09PSBudWxsKXtcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKFwidGFyZ2V0XCIpXG4gICAgfWVsc2V7XG4gICAgICAgIG9sZENhcmQuY2xhc3NMaXN0LnJlbW92ZShcInRhcmdldFwiKVxuICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoXCJ0YXJnZXRcIilcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBvc3QoaWQsdGl0bGUsY2F0ZWdvcnksZGVzYyl7XG4gICAgY29uc3QgcGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgIHBhcmVudC5jbGFzc0xpc3QuYWRkKFwicG9zdFwiKVxuICAgIHBhcmVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLGBwb3N0JHtpZH1gKVxuXG4gICAgY29uc3QgdGl0bGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgdGl0bGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInRpdGxlQ29udGFpbmVyXCIpXG5cbiAgICBjb25zdCB0aXRsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg1XCIpXG4gICAgdGl0bGVFbC50ZXh0Q29udGVudCA9IHRpdGxlXG4gICAgdGl0bGVDb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGVFbClcblxuICAgIGNvbnN0IGNhdGVnb3J5RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDZcIilcbiAgICBjYXRlZ29yeUVsLnRleHRDb250ZW50ID0gXCItXCIrY2F0ZWdvcnlcbiAgICB0aXRsZUNvbnRhaW5lci5hcHBlbmRDaGlsZChjYXRlZ29yeUVsKSBcblxuICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aXRsZUNvbnRhaW5lcilcblxuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKVxuICAgIGNvbnRlbnQudGV4dENvbnRlbnQgPSBkZXNjXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKGNvbnRlbnQpXG5cbiAgICByZXR1cm4gcGFyZW50O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlQ2F0ZWdvcnkoY2F0KXtcbiAgICBpZihjYXQgPT09IFwicHVibGljc2VydmljZXNcIil7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1lbHNlIGlmKGNhdCA9PT0gXCJyZWN5Y2xpbmdcIil7XG4gICAgICAgIHJldHVybiAyO1xuICAgIH1lbHNlIGlmKGNhdCA9PT0gXCJsYW5kc2NhcGVcIil7XG4gICAgICAgIHJldHVybiAzO1xuICAgIH1lbHNle1xuICAgICAgICByZXR1cm4gNDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRlc3Ryb3lQb3N0cygpe1xuICAgIGNvbnN0IHBvc3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBvc3RcIilcbiAgICBpZihwb3N0cy5sZW5ndGggPiAwKXtcbiAgICAgICAgd2hpbGUocG9zdHMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICBwb3N0c1swXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBvc3RzWzBdKVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBHRVQgQUxMIFNVR0dFU1RJT05TXG5hc3luYyBmdW5jdGlvbiBsb2FkQWxsU3VnZ2VzdGlvbnMoKXtcbiAgICBjb25zdCBzdWdnZXN0aW9uc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3VnZ2VzdGlvbnNcIilcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvc3VnZ2VzdGlvbnNcIilcbiAgICBjb25zdCBwb3N0cyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuICAgIHBvc3RzLmZvckVhY2gocG9zdCA9PiB7XG4gICAgICAgIGNvbnN0IG5ld1Bvc3QgPSBjcmVhdGVQb3N0KHBvc3QuaWQscG9zdC50aXRsZSxwb3N0LmNhdGVnb3J5X25hbWUscG9zdC5jb250ZW50KVxuICAgICAgICBzdWdnZXN0aW9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZChuZXdQb3N0KVxuICAgIH0pXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRQb3N0c0Zyb21DYXRlZ29yeSgpe1xuICAgIFxuICAgIGNvbnN0IHN1Z2dDb250ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdWdnZXN0aW9uc1wiKVxuICAgIGNvbnN0IHRvcGljID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXJnZXRcIilcbiAgICBjb25zdCBwb3N0SWR4ID0gcmVzb2x2ZUNhdGVnb3J5KHRvcGljLmlkKVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDozMDAwL2NhdGVnb3JpZXMvJHtwb3N0SWR4fS9zdWdnZXN0aW9uc2ApXG4gICAgY29uc3QgcG9zdHMgPSBhd2FpdCByZXNwb25zZS5qc29uKClcblxuICAgIHBvc3RzLmZvckVhY2gocG9zdCA9PiB7XG4gICAgICAgIGNvbnN0IG5ld1Bvc3QgPSBjcmVhdGVQb3N0KHBvc3QuaWQscG9zdC50aXRsZSxwb3N0LmNhdGVnb3J5X25hbWUscG9zdC5jb250ZW50KVxuICAgICAgICBzdWdnQ29udC5hcHBlbmRDaGlsZChuZXdQb3N0KVxuICAgIH0pXG5cbiAgICBcbn1cblxuYXN5bmMgZnVuY3Rpb24gcG9zdFN1Z2dlc3Rpb24oZSl7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBjb25zdCB0aXRsZUVudHJ5ID0gZS50YXJnZXQudGl0bGUudmFsdWU7XG4gICAgY29uc3QgY2F0ZWdvcnkgPSBlLnRhcmdldC5jYXRlZ29yeS52YWx1ZTtcbiAgICBjb25zdCBkZXNjRW50cnkgPSBlLnRhcmdldC5jb250ZW50LnZhbHVlO1xuXG4gICAgLy8gY29uc3QgcG9zdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicG9zdFwiKVxuXG4gICAgY29uc3QgY2F0SWR4ID0gcmVzb2x2ZUNhdGVnb3J5KGNhdGVnb3J5KTtcblxuICAgIGlmKHRpdGxlRW50cnkudHJpbSgpLmxlbmd0aCA+IDAgJiYgZGVzY0VudHJ5LnRyaW0oKS5sZW5ndGggPjApe1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOlwiUE9TVFwiLFxuICAgICAgICAgICAgaGVhZGVyczp7XCJDb250ZW50LVR5cGVcIjpcImFwcGxpY2F0aW9uL2pzb25cIn0sXG4gICAgICAgICAgICBib2R5OkpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICBjYXRlZ29yeV9uYW1lOmNhdGVnb3J5LFxuICAgICAgICAgICAgICAgIHRpdGxlOnRpdGxlRW50cnksXG4gICAgICAgICAgICAgICAgY29udGVudDpkZXNjRW50cnksXG4gICAgICAgICAgICAgICAgdXNlcl9pZDoxXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9jYXRlZ29yaWVzLyR7Y2F0SWR4fS9zdWdnZXN0aW9uc2Asb3B0aW9ucylcbiAgICAgICAgZGVzdHJveVBvc3RzKClcbiAgICAgICAgbG9hZEFsbFN1Z2dlc3Rpb25zKClcbiAgICB9XG4gICAgZS50YXJnZXQudGl0bGUudmFsdWUgPSBcIlwiO1xuICAgIGUudGFyZ2V0LmNvbnRlbnQudmFsdWUgPSBcIlwiO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtjaGFuZ2VUYXJnZXQsbG9hZEFsbFN1Z2dlc3Rpb25zLCBwb3N0U3VnZ2VzdGlvbixsb2FkUG9zdHNGcm9tQ2F0ZWdvcnksZGVzdHJveVBvc3RzfSJdfQ==
