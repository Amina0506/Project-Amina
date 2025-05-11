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

      
      //alert('Pas op, als je deze pagina refresht verdwijnen al jouw favorieten!')
        
      
      /* Voor het random genereren van een Pokemon*/
      const pokemons = [
        {
          name: "Pikachu",
          img: "images/pikachu.png",
          desc: "Een elektrische muis Pokémon."
        },
        {
          name: "Bulbasaur",
          img: "images/bulbasaur.png",
          desc: "Een gras-type Pokémon met een zaad op zijn rug."
        },
        {
          name: "Charmander",
          img: "images/charmander.png",
          desc: "Een vuur-type Pokémon met een vlam aan zijn staart."
        },
        {
          name: "Squirtle",
          img: "images/squirtle.png",
          desc: "Een water-type schildpad Pokémon."
        }
      ];
      
      let index = 0;
      
      document.getElementById("next-btn").addEventListener("click", () => {
        index = (index + 1) % pokemons.length;
        const p = pokemons[index];
      
        document.getElementById("pokemon-name").textContent = p.name;
        document.getElementById("pokemoncard-img").src = p.img;
        document.getElementById("pokemon-desc").textContent = p.desc;
      });
      


    });
  });
