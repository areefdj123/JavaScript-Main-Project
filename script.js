function hidemodalbox (){
    const closebutton = document.querySelector(".modalbox")
    closebutton.style.display = "none"
}
function showmodalbox(){
    const showmodalbox = document.querySelector(".modalbox")
    showmodalbox.style.display = "flex"
    showmodalbox.style.flexDirection = "column"
}