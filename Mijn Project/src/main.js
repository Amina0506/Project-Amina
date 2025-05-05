// data ophalen uit de API

fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
  .then(response => response.json())
  .then(data => {
    const pokemonList = data.results;
    pokemonList.forEach(pokemon => {
      fetchPokemonDetails(pokemon.url);
    });
  });

  function fetchPokemonDetails(url) {
    fetch(url)
      .then(response => response.json())
      .then(pokemon => {
        const name = pokemon.name;
        const image = pokemon.sprites.front_default;
   
        // Voeg toe aan je HTML
        const container = document.getElementById('pokemon-container');
        const card = document.createElement('div');
        card.innerHTML = `
  <h3>${name}</h3>
  <img src="${image}" alt="${name}">
        `;
        container.appendChild(card);
      });
  }