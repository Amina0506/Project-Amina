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

          const types = pokemon.types.map(t => t.type.name).join(', ');
          const abilities = pokemon.abilities.map(a => a.ability.name).join(', ');
          const height = pokemon.height/10;
          const weight = pokemon.weight/10;
          const xp = pokemon.base_experience;

          div.innerHTML = `
            <img src="${pokemon.sprites.front_default}" style="width:200px;">
            <h2> ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            <p class="info" style="font-size:20px;"><strong style="color:#2d1b13">Type:</strong> ${types}</p>
            <p class="info" style="font-size:20px;"><strong style="color:#2d1b13">Abilities:</strong> ${abilities}</p>
            <p class="info" style="font-size:20px;"><strong style="color:#2d1b13">Hoogte:</strong> ${height} m</p>
            <p class="info" style="font-size:20px;"><strong style="color:#2d1b13">Gewicht:</strong> ${weight} kg</p>
            <p class="info" style="font-size:20px;"><strong style="color:#2d1b13">XP:</strong> ${xp}</p>
          `
          ;
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

        //Functie na het klikken op het icoontje
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
          desc: "Zorgt altijd voor een schok van energie!"
        },
        {
          name: "Bulbasaur",
          img: "images/bulbasaur.png",
          desc: "Groeit stilletjes uit tot een groene legende."
        },
        {
          name: "Charmander",
          img: "images/charmander.png",
          desc: "Klein lijf, grote vlam. Pas op!"
        },
        {
          name: "Squirtle",
          img: "images/squirtle.png",
          desc: "Spat rond met stijl en straal."
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