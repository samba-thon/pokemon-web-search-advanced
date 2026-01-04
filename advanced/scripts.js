// Global variables
let allPokemon = []; // To store all Pokemon names
let selectedIndex = -1; // For keyboard navigation
let currentPokemon = null; // Currently displayed Pokemon

const button = document.querySelector("#search-btn");
const input = document.querySelector("#pokemon-input");
const randomBtn = document.querySelector("#random-btn");

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
  const suggestions = document.querySelectorAll("#suggestions li");

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
      document.querySelector("#suggestions").innerHTML = "";
      document.querySelector("#suggestions").style.display = "none";
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
  const typeChart = document.querySelector("#type-chart");
  if (typeChart) typeChart.classList.remove("show");
  const evolutionChain = document.querySelector("#evolution-chain");
  if (evolutionChain) evolutionChain.innerHTML = "";

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );

    if (response.ok) {
      const data = await response.json();
      currentPokemon = data;

      // Fetch species data
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();

      const pokemonDescription =
        speciesData.flavor_text_entries
          .find((entry) => entry.language.name === "en")
          ?.flavor_text.replace(/[\n\f]/g, " ") || "No description available.";

      // High quality image
      const highQualityImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${data.id}.png`;

      // Build stats HTML
      const statsHTML = buildStatsHTML(data);

      // Build size info
      const sizeHTML = `
        <div class="size-info">
          <div class="size-item">
            <div class="size-label">Height</div>
            <div class="size-value">${(data.height / 10).toFixed(1)}m</div>
          </div>
          <div class="size-item">
            <div class="size-label">Weight</div>
            <div class="size-value">${(data.weight / 10).toFixed(1)}kg</div>
          </div>
          <div class="size-item">
            <div class="size-label">Experience</div>
            <div class="size-value">${data.base_experience}</div>
          </div>
        </div>
      `;

      // Build moves HTML
      const movesHTML = buildMovesHTML(data);

      // Build result
      const html = `
        <h2 style="text-align: center; color: #ff6b6b; margin-bottom: 15px; text-transform: capitalize;">${
          data.name
        }</h2>
        <div style="display: flex; gap: 20px; align-items: flex-start;">
          <div style="flex: 0 0 220px;">
            <img src='${highQualityImage}' alt='${
        data.name
      }' style="width: 100%; height: auto;" />
          </div>
          <div style="flex: 1;">
            <p style="margin-bottom: 12px;"><strong>Type:</strong> ${data.types
              .map((t) => t.type.name)
              .join(", ")}</p>
            <p style="margin-bottom: 12px;"><strong>Ability:</strong> ${data.abilities
              .map((a) => a.ability.name)
              .join(", ")}</p>
            <p style="margin-bottom: 0;"><strong>Description:</strong> ${pokemonDescription}</p>
          </div>
        </div>
        ${sizeHTML}
        ${statsHTML}
        ${movesHTML}
      `;

      document.querySelector("#pokemon-result").innerHTML = html;

      // Show type effectiveness
      displayTypeChart(data.types[0].type.name);

      // Fetch and show evolution chain
      fetchEvolutionChain(speciesData);
    } else {
      document.querySelector("#pokemon-result").innerHTML =
        "<p>Pokemon not found. Please check the name or ID and try again.</p>";
    }
  } catch (error) {
    console.error("Error fetching Pokemon:", error);
    document.querySelector("#pokemon-result").innerHTML =
      "<p>Error loading Pokemon. Please try again.</p>";
  }
}

// Build stats display
function buildStatsHTML(data) {
  const stats = data.stats.slice(0, 6);
  let html =
    '<div class="stats-container"><div class="stat-row"><strong>Base Stats</strong></div>';

  stats.forEach((stat) => {
    const statName =
      stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1);
    const percentage = (stat.base_stat / 255) * 100;
    html += `
      <div class="stat-row">
        <div class="stat-label">${statName}</div>
        <div class="stat-bar">
          <div class="stat-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="stat-value">${stat.base_stat}</div>
      </div>
    `;
  });

  html += "</div>";
  return html;
}

// Build moves display
function buildMovesHTML(data) {
  const moves = data.moves.slice(0, 8).map((m) => m.move.name);
  if (moves.length === 0) return "";

  return `
    <div class="moves-container">
      <div class="moves-title">Signature Moves</div>
      <div class="moves-list">
        ${moves.map((move) => `<div class="move-badge">${move}</div>`).join("")}
      </div>
    </div>
  `;
}

// Type effectiveness chart
async function displayTypeChart(type) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();

    const chartDiv = document.querySelector("#type-chart");

    let html =
      '<div class="type-title">Type Effectiveness for ' +
      type.charAt(0).toUpperCase() +
      type.slice(1) +
      "</div>";

    // Strong against
    if (data.damage_relations.double_damage_to.length > 0) {
      html += `
        <div class="type-section">
          <h4>Strong Against:</h4>
          <div class="type-badges">
            ${data.damage_relations.double_damage_to
              .slice(0, 6)
              .map((t) => `<div class="type-badge">${t.name}</div>`)
              .join("")}
          </div>
        </div>
      `;
    }

    // Weak to
    if (data.damage_relations.double_damage_from.length > 0) {
      html += `
        <div class="type-section">
          <h4>Weak To:</h4>
          <div class="type-badges weak">
            ${data.damage_relations.double_damage_from
              .slice(0, 6)
              .map((t) => `<div class="type-badge weak">${t.name}</div>`)
              .join("")}
          </div>
        </div>
      `;
    }

    chartDiv.innerHTML = html;
    chartDiv.classList.add("show");
  } catch (error) {
    console.error("Error fetching type chart:", error);
  }
}

// Fetch evolution chain
async function fetchEvolutionChain(speciesData) {
  try {
    const chainResponse = await fetch(speciesData.evolution_chain.url);
    const chainData = await chainResponse.json();

    const evolutions = extractEvolutions(chainData.chain);
    if (evolutions.length > 1) {
      displayEvolutionChain(evolutions);
    }
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
  }
}

// Extract evolutions from chain
function extractEvolutions(chain) {
  const evolutions = [];

  function traverse(node) {
    evolutions.push(node.species.name);
    if (node.evolves_to && node.evolves_to.length > 0) {
      traverse(node.evolves_to[0]);
    }
  }

  traverse(chain);
  return evolutions;
}

// Display evolution chain
async function displayEvolutionChain(evolutions) {
  try {
    let html =
      '<div class="evolution-title">Evolution Chain</div><div class="evolution-items">';

    for (let i = 0; i < evolutions.length; i++) {
      const pokemonData = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${evolutions[i]}`
      ).then((r) => r.json());

      const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonData.id}.png`;

      html += `
        <div class="evolution-item">
          <img class="evolution-image" src="${imgUrl}" alt="${evolutions[i]}" />
          <div class="evolution-name">${evolutions[i]}</div>
        </div>
      `;

      if (i < evolutions.length - 1) {
        html += '<div class="evolution-arrow">→</div>';
      }
    }

    html += "</div>";

    const evolutionDiv = document.querySelector("#evolution-chain");
    if (evolutionDiv) {
      evolutionDiv.innerHTML = html;
      evolutionDiv.classList.add("show");
    }
  } catch (error) {
    console.error("Error displaying evolution chain:", error);
  }
}

// Search button click
button.addEventListener("click", searchPokemon);

// Random Pokemon
randomBtn.addEventListener("click", async function () {
  if (allPokemon.length === 0) return;
  const randomPokemon =
    allPokemon[Math.floor(Math.random() * allPokemon.length)];
  if (randomPokemon) {
    input.value = randomPokemon;
    searchPokemon();
  }
});

// Close dropdowns on outside click
document.addEventListener("click", function (e) {
  if (e.target !== input && !e.target.closest("#suggestions")) {
    document.querySelector("#suggestions").innerHTML = "";
    document.querySelector("#suggestions").style.display = "none";
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
    document.querySelector("#suggestions").innerHTML = "";
    document.querySelector("#suggestions").style.display = "none";
    document.querySelector("#pokemon-result").innerHTML = "";
  } else {
    const html = suggestion.map((pokemon) => `<li>${pokemon}</li>`).join("");
    const fullHTML = `<ul>${html}</ul>`;
    document.querySelector("#suggestions").innerHTML = fullHTML;
    document.querySelector("#suggestions").style.display = "block";
  }
});

// Handle suggestion clicks
document.querySelector("#suggestions").addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    const pokemonName = e.target.textContent;
    input.value = pokemonName;
    document.querySelector("#suggestions").innerHTML = "";
    document.querySelector("#suggestions").style.display = "none";
    selectedIndex = -1;
  }
});

// Clear button
document.querySelector("#clear-btn").addEventListener("click", function () {
  input.value = "";
  document.querySelector("#suggestions").innerHTML = "";
  document.querySelector("#suggestions").style.display = "none";
  document.querySelector("#pokemon-result").innerHTML = `
    <div class="welcome-message">
      <h2>👋 Welcome to Pokémon Search!</h2>
      <p>Search for a Pokémon to discover its details</p>
      
      <div class="welcome-tips">
        <h3>How to Search:</h3>
        <ul>
          <li><strong>By Name:</strong> "pikachu", "charizard", "dragonite"</li>
          <li><strong>By ID:</strong> "25", "6", "149"</li>
          <li><strong>🎲 Random:</strong> Click for a surprise Pokémon</li>
        </ul>
      </div>

      <div class="welcome-features">
        <h3>What You'll See:</h3>
        <ul>
          <li>📊 <strong>Base Stats</strong> - Attack, Defense, Speed, etc.</li>
          <li>🔥 <strong>Type Effectiveness</strong> - Strong & weak matchups</li>
          <li>🔗 <strong>Evolution Chain</strong> - Pre-evolution & evolutions</li>
          <li>💪 <strong>Moves</strong> - Moves this Pokémon can learn</li>
        </ul>
      </div>

      <p class="welcome-hint">Try searching for "pikachu" or "25" to get started! ⚡</p>
    </div>
  `;
  document.querySelector("#type-chart").classList.remove("show");
  document.querySelector("#evolution-chain").innerHTML = "";
  input.focus();
  currentPokemon = null;
});

// Load data on page load
loadFromStorage();
