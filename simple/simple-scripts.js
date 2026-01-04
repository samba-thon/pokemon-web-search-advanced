// Global variables
let allPokemon = [];
let selectedIndex = -1;
let currentPokemon = null;

const button = document.querySelector("#search-btn");
const input = document.querySelector("#pokemon-input");

// Update active selection styling
function updateActiveSelection(suggestions) {
  suggestions.forEach((li) => li.classList.remove("active"));
  if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
    suggestions[selectedIndex].classList.add("active");
    suggestions[selectedIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
}

// Keyboard navigation
input.addEventListener("keydown", function (e) {
  const suggestions = document.querySelectorAll("#suggestion li");

  if (e.key === "ArrowDown") {
    if (suggestions.length > 0) {
      selectedIndex = (selectedIndex + 1) % suggestions.length;
      updateActiveSelection(suggestions);
    }
    e.preventDefault();
  } else if (e.key === "ArrowUp") {
    if (suggestions.length > 0) {
      selectedIndex =
        (selectedIndex - 1 + suggestions.length) % suggestions.length;
      updateActiveSelection(suggestions);
    }
    e.preventDefault();
  } else if (e.key === "Enter") {
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      input.value = suggestions[selectedIndex].textContent;
      document.querySelector("#suggestion").innerHTML = "";
      document.querySelector("#suggestion").classList.remove("show");
      selectedIndex = -1;
      searchPokemon();
      e.preventDefault();
    }
  }
});

// Fetch Pokemon data
async function searchPokemon() {
  const pokemonName = input.value.toLowerCase();

  if (!pokemonName) return;

  document.querySelector("#pokemon-result").innerHTML =
    '<p><span class="loading-spinner"></span>Loading...</p>';

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );

    if (response.ok) {
      const data = await response.json();
      currentPokemon = data;

      // Fetch species data for description
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();

      const pokemonDescription =
        speciesData.flavor_text_entries
          .find((entry) => entry.language.name === "en")
          ?.flavor_text.replace(/[\n\f]/g, " ") || "No description available.";

      // High quality image
      const highQualityImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${data.id}.png`;

      // Update title
      document.querySelector("#app-title").textContent = data.name.toUpperCase();

      // Build result
      const html = `
        <img src='${highQualityImage}' alt='${data.name}' />
        <p><strong>Type:</strong> ${data.types
          .map((t) => t.type.name)
          .join(", ")}</p>
        <p><strong>Ability:</strong> ${data.abilities
          .map((a) => a.ability.name)
          .join(", ")}</p>
        <p><strong>Description:</strong> ${pokemonDescription}</p>
      `;

      document.querySelector("#pokemon-result").innerHTML = html;
    } else {
      document.querySelector("#app-title").textContent = "Gotta Catch 'Em All!";
      document.querySelector("#pokemon-result").innerHTML =
        "<p>Pokemon not found. Please check the name or ID and try again.</p>";
    }
  } catch (error) {
    console.error("Error fetching Pokemon:", error);
    document.querySelector("#pokemon-result").innerHTML =
      "<p>Error loading Pokemon. Please try again.</p>";
  }
}

// Search button click
button.addEventListener("click", searchPokemon);

// Close dropdowns on outside click
document.addEventListener("click", function (e) {
  if (e.target !== input && !e.target.closest("#suggestion")) {
    document.querySelector("#suggestion").innerHTML = "";
    document.querySelector("#suggestion").classList.remove("show");
  }
});

// Fetch all Pokemon on focus
input.addEventListener("focus", async function () {
  if (allPokemon.length === 0) {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1000"
    );
    const data = await response.json();
    allPokemon = data.results.map((pokemon) => pokemon.name);
  }
});

// Filter suggestions
input.addEventListener("input", function () {
  const value = input.value.toLowerCase();
  const suggestion = allPokemon
    .filter((pokemon) => pokemon.includes(value))
    .slice(0, 10);

  selectedIndex = -1;

  if (!value) {
    document.querySelector("#suggestion").innerHTML = "";
    document.querySelector("#suggestion").classList.remove("show");
    document.querySelector("#pokemon-result").innerHTML = "";
    document.querySelector("#app-title").textContent = "Gotta Catch 'Em All!";
  } else {
    const html = suggestion.map((pokemon) => `<li>${pokemon}</li>`).join("");
    const fullHTML = `<ul>${html}</ul>`;
    document.querySelector("#suggestion").innerHTML = fullHTML;
    document.querySelector("#suggestion").classList.add("show");
  }
});

// Handle suggestion clicks
document.querySelector("#suggestion").addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    const pokemonName = e.target.textContent;
    input.value = pokemonName;
    document.querySelector("#suggestion").innerHTML = "";
    document.querySelector("#suggestion").classList.remove("show");
    selectedIndex = -1;
  }
});

// Clear button
document.querySelector("#clear-btn").addEventListener("click", function () {
  input.value = "";
  document.querySelector("#suggestion").innerHTML = "";
  document.querySelector("#suggestion").classList.remove("show");
  document.querySelector("#pokemon-result").innerHTML = "";
  document.querySelector("#app-title").textContent = "Gotta Catch 'Em All!";
  input.focus();
  currentPokemon = null;
});
