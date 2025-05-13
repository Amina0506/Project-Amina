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
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" style="width:200px;">
            <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
          `;
        }
      });

      /*Voor de likes*/
      const favorietenSectie = document.getElementById('favorieten');
      const favorietenLijst = document.getElementById('favorieten-lijst');
      const kaarten = document.querySelectorAll('.list > div');

      kaarten.forEach(kaart => {
        kaart.style.position = 'relative';
        const heart = document.createElement('img');
        heart.classList.add('heart');
        heart.src = 'images/heart-symbol.png';

        //Stijl van de afbeelding:
        heart.style.position = 'absolute';
        heart.style.top = '10px';
        heart.style.right = '10px';
        heart.style.width = '30px';
        heart.style.cursor = 'pointer';

        kaart.appendChild(heart);

        heart.addEventListener('click', function () {
          const isFavoriet = heart.src.includes('heart-symbol.png');

          heart.src = isFavoriet ? 'images/heartsymbol-full.png' : 'images/heart-symbol.png';

          if (isFavoriet) {
            const clone = kaart.cloneNode(true);
            const cloneHeart = clone.querySelector('.heart')

            if (cloneHeart) cloneHeart.remove();

            const placeholder = favorietenSectie.querySelector('p');
            if (placeholder) placeholder.remove();

            clone.style.flex = '0 0 auto';
            clone.style.width = '230px';
            clone.style.border = '5px #624e75 solid';
            clone.style.padding = '5px';
            clone.style.boxSizing = 'border-box';
            clone.style.position = 'relative';

            favorietenLijst.appendChild(clone);
          }
        })
      })

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
