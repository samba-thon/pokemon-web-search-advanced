# Complete Code Ready to Copy - Phase 8

## Step 1: Complete HTML File

**File: `index.html`** - Copy this exactly

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pokemon Search App</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="container">
      <h1 id="app-title">Gotta Catch 'Em All!</h1>

      <div class="search-box">
        <div class="input-wrapper">
          <input
            id="pokemon-input"
            type="text"
            placeholder="Search by name or ID"
            autocomplete="off"
          />
          <button id="clear-btn">×</button>
          <div id="suggestions"></div>
        </div>
        <button id="search-btn">Search</button>
      </div>

      <div id="pokemon-result"></div>
    </div>

    <script src="scripts.js"></script>
  </body>
</html>
```

---

## Step 2: Complete CSS File

**File: `styles.css`** - Copy this exactly

```css
/* ============================================
   RESET & BASE STYLES
   ============================================ */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.container {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
  padding: 30px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

/* ============================================
   SEARCH BOX STYLES
   ============================================ */

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.input-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
}

#pokemon-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #ffd93d;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
}

#pokemon-input:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
}

#pokemon-input::placeholder {
  font-style: italic;
  opacity: 0.7;
}

/* ============================================
   CLEAR BUTTON
   ============================================ */

#clear-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: none;
  font-size: 20px;
  line-height: 1;
  transition: transform 0.2s ease;
  font-weight: bold;
}

#pokemon-input:not(:placeholder-shown) ~ #clear-btn {
  display: block;
}

#clear-btn:hover {
  transform: translateY(-50%) scale(1.2);
}

#clear-btn:active {
  transform: translateY(-50%) scale(0.95);
}

/* ============================================
   SEARCH BUTTON
   ============================================ */

#search-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: transform 0.2s ease;
  min-width: 120px;
}

#search-btn:hover {
  transform: translateY(-2px);
}

#search-btn:active {
  transform: translateY(0);
}

/* ============================================
   SUGGESTIONS DROPDOWN
   ============================================ */

#suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 250px;
  overflow-y: auto;
  background: white;
  border: 2px solid #ffd93d;
  border-top: none;
  border-radius: 0 0 10px 10px;
  z-index: 100;
  display: none;
}

#suggestions ul {
  list-style: none;
}

#suggestions li {
  padding: 12px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #eee;
}

#suggestions li:last-child {
  border-bottom: none;
}

#suggestions li:hover,
#suggestions li.active {
  background-color: #ffd93d;
  color: #333;
  font-weight: bold;
}

/* ============================================
   RESULT DISPLAY
   ============================================ */

#pokemon-result {
  text-align: center;
}

#pokemon-result h2 {
  color: #ff6b6b;
  text-transform: capitalize;
  margin-bottom: 15px;
  font-size: 24px;
}

#pokemon-result img {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #ffd93d 0%, #ffed4e 100%);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  border: 3px solid #ff6b6b;
  transition: transform 0.3s ease;
  object-fit: contain;
}

#pokemon-result img:hover {
  transform: scale(1.05);
}

#pokemon-result p {
  padding: 12px 15px;
  margin-bottom: 10px;
  border-left: 4px solid;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  text-align: left;
}

#pokemon-result p:first-of-type {
  border-left-color: #ff6b6b;
}

#pokemon-result p:nth-of-type(2) {
  border-left-color: #4ecdc4;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 600px) {
  .container {
    padding: 20px;
  }

  h1 {
    font-size: 22px;
    margin-bottom: 20px;
  }

  .search-box {
    flex-direction: column;
    gap: 15px;
  }

  #pokemon-input,
  #search-btn {
    width: 100%;
  }

  #pokemon-result img {
    width: 150px;
    height: 150px;
  }

  #pokemon-result h2 {
    font-size: 20px;
  }
}

@media (max-width: 320px) {
  .container {
    padding: 15px;
  }

  h1 {
    font-size: 18px;
  }

  #pokemon-input,
  #search-btn {
    padding: 10px 12px;
    font-size: 14px;
  }

  #clear-btn {
    width: 28px;
    height: 28px;
    font-size: 18px;
  }
}
```

---

## Step 3: Complete JavaScript File

**File: `scripts.js`** - Copy this exactly

```javascript
// ============================================
// GLOBAL VARIABLES
// ============================================

let allPokemon = []; // Cache of all Pokemon names
let selectedIndex = -1; // Currently selected suggestion (-1 = none)

// Cache frequently used DOM elements
const button = document.querySelector("#search-btn");
const input = document.querySelector("#pokemon-input");
const suggestionsDiv = document.querySelector("#suggestions");
const resultDiv = document.querySelector("#pokemon-result");

// ============================================
// HELPER FUNCTION
// ============================================

/**
 * Updates the visual highlighting of suggestions and scrolls to selected item
 * Called by: keyboard navigation, ensures consistent highlighting
 */
function updateActiveSelection(suggestions) {
  // Remove active class from all suggestions
  suggestions.forEach((li) => li.classList.remove("active"));

  // Add active class to currently selected item
  if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
    suggestions[selectedIndex].classList.add("active");

    // Scroll selected item into view with minimal movement
    suggestions[selectedIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
}

// ============================================
// EVENT 1: LOAD ALL POKEMON ON FOCUS (Lazy Loading)
// ============================================

/**
 * Fetches all 1000+ Pokemon names when user first focuses the input
 * Only fetches once (checked with allPokemon.length === 0)
 * This improves performance by not loading data until needed
 */
input.addEventListener("focus", async function () {
  // Only fetch if we haven't already cached the data
  if (allPokemon.length === 0) {
    try {
      console.log("Fetching all Pokemon...");

      // Fetch all Pokemon from PokéAPI
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=1000"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Pokemon list");
      }

      const data = await response.json();

      // Extract just the names from the results
      allPokemon = data.results.map((pokemon) => pokemon.name);

      console.log(`Loaded ${allPokemon.length} Pokemon successfully`);
    } catch (error) {
      console.error("Error loading Pokemon list:", error);
      // User can still try to search by exact name
    }
  }
});

// ============================================
// EVENT 2: FILTER SUGGESTIONS AS USER TYPES
// ============================================

/**
 * Filters suggestions and displays them as user types
 * Shows up to 10 matching Pokemon
 * Clears results when input is empty
 */
input.addEventListener("input", function () {
  const value = input.value.toLowerCase();

  // Filter Pokemon that contain the user's input
  const suggestions = allPokemon
    .filter((pokemon) => pokemon.includes(value))
    .slice(0, 10); // Limit to 10 results

  // CRITICAL: Reset keyboard selection when suggestions change
  // This prevents index out of bounds errors
  selectedIndex = -1;

  if (!value) {
    // Clear suggestions and results when input is empty
    suggestionsDiv.innerHTML = "";
    resultDiv.innerHTML = "";
    document.querySelector("#app-title").textContent = "Gotta Catch 'Em All!";
  } else {
    // Build HTML for suggestions
    const html = suggestions.map((pokemon) => `<li>${pokemon}</li>`).join("");

    // Only show dropdown if there are suggestions
    if (suggestions.length > 0) {
      suggestionsDiv.innerHTML = `<ul>${html}</ul>`;
    } else {
      suggestionsDiv.innerHTML = "";
    }
  }
});

// ============================================
// EVENT 3: KEYBOARD NAVIGATION (Arrow Keys & Enter)
// ============================================

/**
 * Handles keyboard navigation through suggestions
 * ArrowDown: Move to next suggestion (wrap to start if at end)
 * ArrowUp: Move to previous suggestion (wrap to end if at start)
 * Enter: Select current suggestion and fill input
 */
input.addEventListener("keydown", function (e) {
  const suggestions = document.querySelectorAll("#suggestions li");

  // Arrow Down Key: Move forward with wrap-around
  if (e.key === "ArrowDown") {
    if (suggestions.length > 0) {
      // Wrap-around logic: (0+1)%3=1, (2+1)%3=0
      selectedIndex = (selectedIndex + 1) % suggestions.length;
      updateActiveSelection(suggestions);
    }
    e.preventDefault(); // Prevent cursor movement
  }

  // Arrow Up Key: Move backward with wrap-around
  else if (e.key === "ArrowUp") {
    if (suggestions.length > 0) {
      // Wrap-around backward: (-1+3)%3=2
      selectedIndex =
        (selectedIndex - 1 + suggestions.length) % suggestions.length;
      updateActiveSelection(suggestions);
    }
    e.preventDefault(); // Prevent cursor movement
  }

  // Enter Key: Select current suggestion
  else if (e.key === "Enter") {
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      // Fill input with selected Pokemon name
      input.value = suggestions[selectedIndex].textContent;

      // Close suggestions dropdown
      suggestionsDiv.innerHTML = "";

      // Reset selection for next search
      selectedIndex = -1;

      e.preventDefault();
    }
  }
});

// ============================================
// EVENT 4: SEARCH BUTTON CLICK
// ============================================

/**
 * Main search function
 * Fetches specific Pokemon data from API
 * Displays results or error message
 */
button.addEventListener("click", async function () {
  const pokemonName = input.value.toLowerCase();

  // Validate input
  if (!pokemonName.trim()) {
    resultDiv.innerHTML = `
      <h2>Please enter a Pokemon name or ID</h2>
    `;
    return;
  }

  // Show loading state
  resultDiv.innerHTML = "<p>Loading...</p>";

  try {
    // Fetch specific Pokemon data
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );

    if (response.ok) {
      const data = await response.json();

      // Update h1 with Pokemon name
      document.querySelector("#app-title").textContent =
        data.name.toUpperCase();

      // Build HTML from Pokemon data
      const html = `
        <img 
          src="${data.sprites.front_shiny}" 
          alt="${data.name}"
          onerror="this.src='${data.sprites.front_default}'"
        />
        <p><strong>Type:</strong> ${data.types[0].type.name}</p>
        <p><strong>Ability:</strong> ${data.abilities[0].ability.name}</p>
      `;

      resultDiv.innerHTML = html;
    } else {
      // Pokemon not found (404)
      document.querySelector("#app-title").textContent = "Gotta Catch 'Em All!";
      resultDiv.innerHTML = `
        <p>Pokemon not found. Please check the name or ID and try again.</p>
        <p>Example: pikachu, charizard, 1, 25</p>
      `;
    }
  } catch (error) {
    // Network error or API problem
    console.error("Fetch error:", error);
    resultDiv.innerHTML = `
      <h2>Error</h2>
      <p>Network error. Please try again later.</p>
    `;
  }
});

// ============================================
// EVENT 5: SUGGESTION CLICK (Event Delegation)
// ============================================

/**
 * Handles clicking on a suggestion
 * Uses event delegation: listens on parent, checks target
 * This is more efficient than adding listeners to each item
 */
suggestionsDiv.addEventListener("click", function (e) {
  // Check if clicked element is a suggestion item
  if (e.target.tagName === "LI") {
    const pokemonName = e.target.textContent;

    // Fill input with selected Pokemon
    input.value = pokemonName;

    // Close suggestions
    suggestionsDiv.innerHTML = "";

    // Reset selection
    selectedIndex = -1;

    // Keep focus on input for continued typing
    input.focus();
  }
});

// ============================================
// EVENT 6: CLOSE DROPDOWN ON OUTSIDE CLICK
// ============================================

/**
 * Closes suggestions dropdown when user clicks outside
 * Uses .closest() to check if click was inside suggestions
 */
document.addEventListener("click", function (e) {
  // Close if click is NOT on input AND NOT inside suggestions
  if (e.target !== input && !e.target.closest("#suggestions")) {
    suggestionsDiv.innerHTML = "";
  }
});

// ============================================
// EVENT 7: CLEAR BUTTON CLICK
// ============================================

/**
 * Clears all input, suggestions, and results
 * Refocuses input for quick new search
 */
document.querySelector("#clear-btn").addEventListener("click", function () {
  // Clear input value
  input.value = "";

  // Close suggestions dropdown
  suggestionsDiv.innerHTML = "";

  // Clear results display
  resultDiv.innerHTML = "";

  // Reset h1 to Pokemon-themed greeting
  document.querySelector("#app-title").textContent = "Gotta Catch 'Em All!";

  // Reset keyboard selection
  selectedIndex = -1;

  // Refocus input for immediate new search
  input.focus();
});
```

---

## How to Use These Files

1. Create three new files in your Pokemon App folder:

   - `index.html`
   - `styles.css`
   - `scripts.js`

2. Copy-paste each section into its corresponding file

3. Open `index.html` in your browser

4. Done! You have a fully working Pokemon Search App

---

## Next Steps

Go to **[5-TEMPLATES.md](../simple/docs/5-TEMPLATES.md)** to build an Animal app or other similar projects!
