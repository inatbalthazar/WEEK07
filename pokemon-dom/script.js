const progressX = document.getElementById("pokemon-container");
const btnPokemon = document.getElementById("findPokemon");
const random = document.getElementById("randomPokemon");

// random pokemon done
// add name (แสดงชื่อ pokemon) done
// remove when click (ปุ่ม reset) done
// add some styles to that (ทำ css) done

btnPokemon.addEventListener("click", async () => {
  const findPokemon = document.getElementById("pokemonInput").value.trim();

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${findPokemon}`);
    const data = await response.json();

    progressX.innerHTML = "";
    const div = document.createElement("div");
    div.classList.add("pokemon-card");
    const pokemonName = document.createElement("h3");
    pokemonName.textContent = data.name;

    const img = document.createElement("img");
    img.src = data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default;

    div.appendChild(pokemonName);
    div.appendChild(img);

    progressX.appendChild(div);

  } catch (error) {
    console.log("Error:", error);
  }
});

random.addEventListener("click", async () => {
  const randomNum = Math.floor(Math.random() * 1025);
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomNum}`);
    const data = await response.json();

    progressX.innerHTML = "";
    const div = document.createElement("div");
    div.classList.add("pokemon-card");
    const pokemonName = document.createElement("h3");
    pokemonName.textContent = data.name;

    const img = document.createElement("img");
    img.src = data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default;

    div.appendChild(pokemonName);
    div.appendChild(img);

    progressX.appendChild(div);

  } catch (error) {
    console.log("Error:", error);
  }
});

const reset = document.getElementById("resetPokemon");
reset.addEventListener("click", () => {
  progressX.innerHTML = "";
})