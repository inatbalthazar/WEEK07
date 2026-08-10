// Content, Attributes & Classes
// Open index.html and work through these in order.

// TODO 1: Select #heading and change its textContent to "Welcome!"
console.log(document.getElementById("heading").textContent); // ก่อนเปลี่ยน

const h2Heading = document.getElementById("heading").textContent = "Welcome!"

console.log(document.getElementById("heading").textContent); // หลังเปลี่ยน

// TODO 2: Select #bio (it currently reads "I am learning the DOM."). Set its
// innerHTML so the word "learning" is wrapped in a <strong> tag, i.e. the
// paragraph should read: I am <strong>learning</strong> the DOM.
console.log(document.getElementById("bio").textContent); // ก่อนเปลี่ยน

const pBio = document.getElementById("bio").innerHTML = "I am <strong>learning</strong>";

console.log(document.getElementById("bio").textContent); // หลังเปลี่ยน

// TODO 3: Select #card. Read its "class" attribute with getAttribute and
// console.log() it.
console.log(document.getElementById("card").getAttribute("class"));
console.log(document.getElementsByClassName("card").textContent);

// TODO 4: Add the "highlight" class to #card using classList.add, then
// console.log(card.className) to see it there. (You'll learn to do this in
// response to a click in the next exercise, 03-events-basics.)
const cardHighlight = document.getElementById("card");
card.classList.add("highlight");
console.log(cardHighlight.className);

// TODO 5: #card starts with a data-visits="0" attribute. Read the current
// value with card.dataset.visits, convert it to a number, add 1, write it
// back to card.dataset.visits, and console.log() the new value.
let dataVisit = card.dataset.visits;
let numVisit = Number(dataVisit); // แปลงเป็น number
let addOne = numVisit + 1;
card.dataset.visits = addOne;
console.log(card.dataset.visits);

addOne = numVisit + 5;
card.dataset.visits = addOne;
console.log(card.dataset.visits);