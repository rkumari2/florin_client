function changeTarget(card){
    const oldCard = document.querySelector(".target");
    oldCard.classList.remove("target")
    card.classList.add("target")
}

module.exports = {changeTarget}