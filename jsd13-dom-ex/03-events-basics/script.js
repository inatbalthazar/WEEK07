// Events Basics
// Open index.html and work through these in order.

// TODO 1: Select #box, #log, and #key-display.
console.log(document.getElementById("box"));
console.log(document.getElementById("log"));
console.log(document.getElementById("key-display"));

// TODO 2: Add a "click" listener on #box that sets log's textContent to
// "Box clicked!". Inside the same listener, console.log() the event's
// event.type and event.target (the event object is the first argument
// your listener function receives).
const boxClick = document.getElementById("box");
let count = 0;
// boxClick.addEventListener("click", ()=> {
//     boxClick.textContent = "Box clicked!";
// })
boxClick.addEventListener("click", ()=>{
    count++;
    boxClick.textContent = "Clicked" + " " + count; 
});

// TODO 3: Add a "mouseover" listener on #box that adds the "hover" class
// to it, and a "mouseout" listener that removes the "hover" class.
const boxHover = document.getElementById("box");
boxHover.addEventListener("mouseover", () => {
    boxHover.classList.add("hover");
});

boxHover.addEventListener("mouseout", () => {
  boxHover.classList.remove("hover");
});



// TODO 4: Add a "keydown" listener on the whole document. Inside it, set
// key-display's textContent to event.key (the key that was pressed).
