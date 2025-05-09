const itemDivs = document.querySelectorAll('.pokemon-list .list > div');

// 20 Pokemons ophalen
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
            <div class="favorites">
              <img src="images/heart-symbol.png" alt="" width="30px" class="heart" style="cursor: pointer;">
            </div>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" style="width:200px;">
            <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
          `;
        }
      });

      const heartIcons = document.querySelectorAll('.heart');
      heartIcons.forEach(heartIcon => {
        heartIcon.addEventListener('click', function () {
          if (heartIcon.src.includes('heart-symbol.png')) {
            heartIcon.src = 'images/heartsymbol-full.png';
          } else {
            heartIcon.src = 'images/heart-symbol.png';
          }
        });
      });



    });
  });
