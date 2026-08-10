// Form Events
// Open index.html and work through these in order.

// TODO 1: Select #signup-form, #name-input, #char-count, and #feedback.
const signUpForm = document.querySelector("#signup-form");
const nameInput = document.querySelector("#name-input");
const charCount = document.querySelector("#char-count");
const feedBack = document.querySelector("#feedback");

// TODO 2: Add an "input" listener on #name-input. Every time the user types,
// set char-count's textContent to the current length of the input's value
// (name-input.value.length).
nameInput.addEventListener("input", (event) => {
    console.log(nameInput);
    console.log(nameInput.value);
    console.log(nameInput.value.length);
    charCount.textContent = nameInput.value.length;
});

// TODO 3: Add a "submit" listener on #signup-form. Inside it:
//   - call event.preventDefault() so the page doesn't reload
//   - read and trim the name input's value
//   - if it's empty, set feedback's textContent to "Name required"
//   - otherwise, set feedback's textContent to `Welcome, ${name}!`
signUpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    console.log(name);

    if(name === ""){
        feedBack.textContent = "Name required";
    } else {
        feedBack.textContent = `Welcome, ${name}!`;
    }
});