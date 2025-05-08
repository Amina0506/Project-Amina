// Alle item-divs selecteren
const itemDivs = document.querySelectorAll('.pokemon-list .list > div');

// Haal 20 Pokémon op
fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
  .then(response => response.json())
  .then(data => {
    const pokemonList = data.results;

    // Voor elke Pokémon details ophalen
    const promises = pokemonList.map(pokemon => fetch(pokemon.url).then(res => res.json()));
    Promise.all(promises).then(pokemonDetails => {
      // Itereer over de bestaande divs en vul ze met data
      pokemonDetails.forEach((pokemon, index) => {
        const div = itemDivs[index];
        if (div) {
          div.innerHTML = `
          <img src="images/heart-symbol.png" alt="" style="width:20px; display:flex; justify-content:flex-end;">
<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" style="width:200px;">
<h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            `;
        }
      });
    });
  });