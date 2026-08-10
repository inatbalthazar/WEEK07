// Write your demo code here, section by section.
// The HTML file has matching ids/classes for each topic:
//
// 1. Selecting Elements   -> #main-title, .submit-btn, .task
// 2. Modifying Content    -> .label, #msg, #card
// 3. classList            -> #themeBtn, .card
// 4. Create & Remove      -> #addTaskBtn, #resetTasksBtn, #tasks
// 5. Events               -> #click-me, #list, #signupForm, #email, .error
const btn = document.querySelector("#click-me");
let count = 0;
const eventDiv = document.querySelector("#event-div");
btn.addEventListener("click", (e)=>{
    eventDiv.innerHTML += `img width="100px" heigth="100px" src="https://upload.wikimedia.org/wikipedia/commons/7/78/Image.jpg?utm_source=th.wikipedia.org&utm_campaign=index&utm_content=original"`;
    count++;
    btn.textContent = "Clicked" + " " + count;
});

document.addEventListener("keydown", (e) => {
    console.log(e)
    console.log(e.key);
})


// 6. Pokémon Card Fetcher -> #fetchBtn, #resetBtn, #gallery
const emailInput = document.querySelector("#email");

emailInput.addEventListener("input", (e) => {
    console.log(e.target.value);
    eventDiv.textContent = e.target.value;
});