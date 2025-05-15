const itemDivs = document.querySelectorAll('.pokemon-list .list > div');

// 20 Pokemons ophalen
fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
  .then(response => response.json())
  .then(data => {
    const pokemonList = data.results;

    // Voor elke Pokémon details ophalen
    const promises = pokemonList.map(pokemon => fetch(pokemon.url).then(res => res.json()));
    Promise.all(promises).then(pokemonDetails => {
      // Itereert over de bestaande divs en vult ze met data
      pokemonDetails.forEach((pokemon, index) => {
        const div = itemDivs[index];
        if (div) {

          const types = pokemon.types.map(t => t.type.name).join(', ');
          const abilities = pokemon.abilities.map(a => a.ability.name).join(', ');
          const height = pokemon.height / 10;
          const weight = pokemon.weight / 10;
          const xp = pokemon.base_experience;

          div.innerHTML = `
            <img src="${pokemon.sprites.front_default}" style="width:200px;">
            <h2> ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            <p class="info type" style="font-size:20px;"><strong style="color:#2d1b13">Type:</strong> ${types}</p>
            <p class="info abilities" style="font-size:20px;"><strong style="color:#2d1b13">Abilities:</strong> ${abilities}</p>
            <p class="info height" style="font-size:20px;"><strong style="color:#2d1b13">Hoogte:</strong> ${height} m</p>
            <p class="info weight" style="font-size:20px;"><strong style="color:#2d1b13">Gewicht:</strong> ${weight} kg</p>
            <p class="info xp" style="font-size:20px;"><strong style="color:#2d1b13">XP:</strong> ${xp}</p>
          `
            ;
        }
      });

      //Sorteren en filteren
      let currentDetails = [...pokemonDetails]; // Bewaar alle opgehaalde details

      const sortSelect = document.getElementById("sort");
      const filterSelect = document.getElementById("type-filter");
      const tableBody = document.getElementById("personages-section");

      function updateTable(filteredList) {
        tableBody.innerHTML = "";
        filteredList.forEach(pokemon => {
          const row = document.createElement("tr");
          row.innerHTML = `
      <td>${pokemon.name}</td>
      <td>${pokemon.types.map(t => t.type.name).join(", ")}</td>
      <td>${pokemon.abilities.map(a => a.ability.name).join(", ")}</td>
      <td>${pokemon.height / 10}m</td>
      <td>${pokemon.weight / 10}kg</td>
      <td>${pokemon.base_experience}XP</td>
    `;
          tableBody.appendChild(row);
        });
      }

      function applySortAndFilter() {
        let filtered = [...currentDetails];

        const selectedType = filterSelect.value;
        if (selectedType) {
          filtered = filtered.filter(p => p.types.some(t => t.type.name === selectedType));
        }

        const sortValue = sortSelect.value;
        if (sortValue === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortValue === "name-desc") filtered.sort((a, b) => b.name.localeCompare(a.name));
        else if (sortValue === "xp-asc") filtered.sort((a, b) => a.base_experience - b.base_experience);
        else if (sortValue === "height-desc") filtered.sort((a, b) => b.height - a.height);
        else if (sortValue === "weight-desc") filtered.sort((a, b) => b.weight - a.weight);

        updateTable(filtered);
      }

      sortSelect.addEventListener("change", applySortAndFilter);
      filterSelect.addEventListener("change", applySortAndFilter);

      updateTable(currentDetails);



      //Functie voor de tabel
      async function fetchAndDisplayPokemonData() {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const data = await response.json();
        const tableBody = document.getElementById("personages-section");

        for (const pokemon of data.results) {
          const pokemonDetails = await fetch(pokemon.url).then(res => res.json());

          const row = document.createElement("tr");
          row.innerHTML = `
                <td>${pokemonDetails.name}</td>
                <td>${pokemonDetails.types.map(t => t.type.name).join(", ")}</td>
                <td>${pokemonDetails.abilities.map(a => a.ability.name).join(", ")}</td>
                <td>${pokemonDetails.height / 10}m</td>
                <td>${pokemonDetails.weight / 10}kg</td>
                <td>${pokemonDetails.base_experience}XP</td>
            `;
          tableBody.appendChild(row);
        }
      }

      fetchAndDisplayPokemonData();


      //Pokémon zoeken
      const zoekInput = document.querySelector('input[name="zoekterm"]');
      const zoekButton = document.querySelector('#search button');

      //Probleem als men een Pokémon in een gefilterde tabel zoekt,
      //kan het zijn dat de Pokémon niet verschijnt, dit is de oplossing
      zoekButton.addEventListener('click', () => {
        const zoekterm = zoekInput.value.trim().toLowerCase();
        const match = currentDetails.find(p => p.name.toLowerCase() === zoekterm);

        if (match) {
          updateTable([match]);

          //Om naar de gezochte Pokémon te scrollen
          setTimeout(() => {
            const rij = document.querySelector('#personages-section tr');
            rij.style.backgroundColor = '#9b89a9';
            rij.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
              rij.style.backgroundColor = '';
            }, 3000);
          }, 50);
        } else {
          alert(`Geen Pokémon gevonden met de naam "${zoekterm}". Zoek verder!`);
        }
      });


      //Om te zoeken met 'Enter'
      zoekInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          zoekButton.click();
        }
      })


      //Voor de likes
      const favorietenSectie = document.getElementById('favorieten');
      const favorietenLijst = document.getElementById('favorieten-lijst');
      const kaarten = document.querySelectorAll('.list > div');

      const toegevoegdeFavorieten = new Set();

      function addToFavorites(kaart) {
        const clone = kaart.cloneNode(true);

        const cloneHeart = clone.querySelector('.heart');
        if (cloneHeart) cloneHeart.remove();

        const placeholder = favorietenSectie.querySelector('p');
        if (placeholder) placeholder.remove();

        //Stijl van de kaart
        clone.style.flex = '0 0 auto';
        clone.style.width = '230px';
        clone.style.border = '5px #624e75 solid';
        clone.style.padding = '5px';
        clone.style.boxSizing = 'border-box';
        clone.style.position = 'relative';

        const kruis = document.createElement('img');
        kruis.src = 'images/delete.png';
        kruis.alt = 'Verwijderen';
        kruis.classList.add('verwijder-kruis');

        kruis.style.position = 'absolute';
        kruis.style.top = '10px';
        kruis.style.right = '10px';
        kruis.style.width = '30px';
        kruis.style.cursor = 'pointer';

        //Om een kaart te verwijderen
        kruis.addEventListener('click', () => {
          const naam = clone.querySelector('h2')?.textContent;
          if (naam) {
            toegevoegdeFavorieten.delete(naam);
            localStorage.setItem('favorieten', JSON.stringify([...toegevoegdeFavorieten]));

            //Om terug een lege hart te krijgen
            const origineleKaart = [...kaarten].find(k => k.querySelector('h2')?.textContent === naam);
            if (origineleKaart) {
              const hart = origineleKaart.querySelector('.heart');
              if (hart) {
                hart.src = 'images/heart-symbol.png';
              }
            }
          }

          clone.remove();

          if (favorietenLijst.children.length === 0) {
            const p = document.createElement('p');
            p.textContent = "Er is momenteel nog niets te zien...";
            favorietenSectie.insertBefore(p, favorietenLijst);
          }
        });


        clone.appendChild(kruis);
        favorietenLijst.appendChild(clone);
      }


      kaarten.forEach(kaart => {
        kaart.style.position = 'relative';
        const heart = document.createElement('img');
        heart.classList.add('heart');
        heart.src = 'images/heart-symbol.png';

        // Stijl van het hartje
        heart.style.position = 'absolute';
        heart.style.top = '10px';
        heart.style.right = '10px';
        heart.style.width = '30px';
        heart.style.cursor = 'pointer';

        kaart.appendChild(heart);

        //Na het klikken op het hart
        heart.addEventListener('click', function () {
          const isFavoriet = heart.src.includes('heart-symbol.png');
          heart.src = isFavoriet ? 'images/heartsymbol-full.png' : 'images/heart-symbol.png';

          const kaartID = kaart.querySelector('h2')?.textContent || kaart.innerHTML;

          if (isFavoriet) {
            //Om niet twee keer dezelfde kaart in de favorieten te hebben
            if (toegevoegdeFavorieten.has(kaartID)) return;
            toegevoegdeFavorieten.add(kaartID);
            localStorage.setItem('favorieten', JSON.stringify([...toegevoegdeFavorieten]));


            addToFavorites(kaart);
          } else {
            toegevoegdeFavorieten.delete(kaartID);
            localStorage.setItem('favorieten', JSON.stringify([...toegevoegdeFavorieten]));

            [...favorietenLijst.children].forEach(child => {
              if (child.querySelector('h2')?.textContent === kaartID) {
                child.remove();
              }
            });

            if (favorietenLijst.children.length === 0) {
              const p = document.createElement('p');
              p.textContent = "Er is momenteel nog niets te zien...";
              favorietenSectie.insertBefore(p, favorietenLijst);
            }
          }
        });
      });


      let currentLanguage = 'nl';

      // Voor het random genereren van een Pokemon
      const pokemons = [
        {
          name: "Pikachu",
          img: "images/pikachu.png",
          desc: {
            nl: "Zorgt altijd voor een schok van energie!",
            en: "Always delivers a shock of energy!"
          }
        },
        {
          name: "Bulbasaur",
          img: "images/bulbasaur.png",
          desc: {
            nl: "Groeit stilletjes uit tot een groene legende.",
            en: "Quietly grows into a green legend."
          }
        },
        {
          name: "Charmander",
          img: "images/charmander.png",
          desc: {
            nl: "Klein lijf, grote vlam. Pas op!",
            en: "Small body, big flame. Watch out!"
          }
        },
        {
          name: "Squirtle",
          img: "images/squirtle.png",
          desc: {
            nl: "Spat rond met stijl en straal.",
            en: "Splashes around with style and spray."
          }
        }
      ];

      let index = 0;

      document.getElementById("next-btn").addEventListener("click", () => {
        index = (index + 1) % pokemons.length;
        const p = pokemons[index];

        document.getElementById("pokemon-name").textContent = p.name;
        document.getElementById("pokemoncard-img").src = p.img;
        document.getElementById("pokemon-desc").textContent = p.desc[currentLanguage];
      });

      //Om de taal te veranderen
      const languageLink = document.getElementById('taal-verandering');

      //Vertaling van elk element in de website
      const translations = {
        nl: {
          menu1: "POKEMONS",
          menu2: "FAVORIETEN",
          desc1: "Zoek, filter en sorteer je favoriete Pokemons! Ontdek alles: hun namen, type en nog veel meer!",
          desc2: "Gek op een Pokemon? Bewaar ze in je favorieten en raak ze nooit meer kwijt!",
          zoekTitel: "Zoek naar uw favoriete Pokemons en ontdek...!",
          nextButton: "Ontdek de volgende Pokémon !",
          tabelTitel: "Overzicht van alle Pokemons",
          favorietenTitel: "FAVORIETEN",
          favorietenLeeg: "Er is momenteel nog niets te zien...",
          searchButton: "Zoeken",
          //tabel
          thNaam: "Naam",
          thType: "Type",
          thAbility: "Ability",
          thHoogte: "Hoogte",
          thGewicht: "Gewicht",
          thXP: "Aantal XP",
          typeLabel: "Type:",
          abilitiesLabel: "Abilities:",
          heightLabel: "Hoogte:",
          weightLabel: "Gewicht:",
          xpLabel: "XP:",
          type: "Type:",
          abilities: "Abilities:",
          height: "Hoogte:",
          weight: "Gewicht:",
          xp: "XP:",
          //Sorteren
          sortLabel: "Sorteren op:",
          sortKies: "Kies",
          sortNameAZ: "Naam (A-Z)",
          sortNameZA: "Naam (Z-A)",
          sortXPasc: "XP (klein naar groot)",
          sortHeightDesc: "Hoogte (groot naar klein)",
          sortWeightDesc: "Gewicht (groot naar klein)",
          filterLabel: "Filter op type:",
          filterAll: "Alle types",
        },
        en: {
          menu1: "POKEMONS",
          menu2: "FAVOURITES",
          desc1: "Search, filter, and sort your favorite Pokémon! Discover their names, types, and much more!",
          desc2: "In love with a Pokémon? Save them to your favourites so you never lose them!",
          zoekTitel: "Search for your favourite Pokémon and discover...!",
          nextButton: "Discover the next Pokémon!",
          tabelTitel: "Overview of all Pokémons",
          favorietenTitel: "FAVOURITES",
          favorietenLeeg: "There's nothing to see yet...",
          searchButton: "Search",
          //tabel
          thNaam: "Name",
          thType: "Type",
          thAbility: "Ability",
          thHoogte: "Height",
          thGewicht: "Weight",
          thXP: "XP",
          typeLabel: "Type:",
          abilitiesLabel: "Abilities:",
          heightLabel: "Height:",
          weightLabel: "Weight:",
          xpLabel: "XP:",
          type: "Type:",
          abilities: "Abilities:",
          height: "Height:",
          weight: "Weight:",
          xp: "XP:",
          //Sorteren
          sortLabel: "Sort by:",
          sortKies: "Select",
          sortNameAZ: "Name (A-Z)",
          sortNameZA: "Name (Z-A)",
          sortXPasc: "XP (low to high)",
          sortHeightDesc: "Height (high to low)",
          sortWeightDesc: "Weight (high to low)",
          filterLabel: "Filter by type:",
          filterAll: "All types",
        }
      };

      languageLink.addEventListener('click', (e) => {
        e.preventDefault();
        const currentLang = languageLink.dataset.lang;
        const newLang = currentLang === 'nl' ? 'en' : 'nl';

        //Update tekst op pagina
        const t = translations[newLang];
        const ths = document.querySelectorAll('#personages-tabel thead th');

        //Vertaling van elk element in de website
        ths[0].textContent = t.thNaam;
        ths[1].textContent = t.thType;
        ths[2].textContent = t.thAbility;
        ths[3].textContent = t.thHoogte;
        ths[4].textContent = t.thGewicht;
        ths[5].textContent = t.thXP;
        document.querySelectorAll('a[href="#pokemons"]')[0].textContent = t.menu1;
        document.querySelectorAll('a[href="#favorieten"]')[0].textContent = t.menu2;
        document.querySelectorAll('a[href="#favorieten"]')[1].textContent = t.menu2;
        document.querySelectorAll('.li-submenu .menu-description')[0].textContent = t.desc1;
        document.querySelectorAll('.li-submenu + li .menu-description')[0].textContent = t.desc2;
        document.querySelector('.beschrijving').textContent = t.zoekTitel;
        document.querySelector('#next-btn').textContent = t.nextButton;
        document.querySelector('section h1').textContent = t.tabelTitel;
        document.querySelector('.FAVORIETEN h1').textContent = t.favorietenTitel;
        document.getElementById('Zoeken').textContent = t.searchButton;

        //Vertaling van de elementen in de kaarten
        const labels = ['type', 'abilities', 'height', 'weight', 'xp'];
        labels.forEach(label => {
          document.querySelectorAll(`.${label}`).forEach(el => {
            const strong = el.querySelector('strong');
            if (strong) strong.textContent = t[label];
          });
        });

        // Filters vertalen
        document.querySelector('label[for="sort"]').textContent = t.sortLabel;
        document.querySelector('label[for="type-filter"]').textContent = t.filterLabel;

        const sortOptions = document.querySelectorAll('#sort option');
        sortOptions[0].textContent = t.sortKies;
        sortOptions[1].textContent = t.sortNameAZ;
        sortOptions[2].textContent = t.sortNameZA;
        sortOptions[3].textContent = t.sortXPasc;
        sortOptions[4].textContent = t.sortHeightDesc;
        sortOptions[5].textContent = t.sortWeightDesc;

        document.querySelector('#type-filter option[value=""]').textContent = t.filterAll;



        const favorietPlaceholder = document.querySelector('#favorieten p');
        if (favorietPlaceholder) favorietPlaceholder.textContent = t.favorietenLeeg;

        //Verandering van de knop
        languageLink.textContent = currentLang === 'nl' ? 'NED' : 'EN';
        languageLink.dataset.lang = newLang;

        const itemDivs = document.querySelectorAll('.pokemon-list .list > div');

        const currentPokemon = pokemons[index];
        document.getElementById("pokemon-desc").textContent = currentPokemon.desc[newLang];
        currentLanguage = newLang;

      });

      //Favorieten bijhouden
      const opgeslagenFavorieten = JSON.parse(localStorage.getItem('favorieten')) || [];

      opgeslagenFavorieten.forEach(kaartNaam => {
        const kaart = [...kaarten].find(k => {
          const h2 = k.querySelector('h2');
          return h2 && h2.textContent === kaartNaam;
        });

        if (kaart) {
          toegevoegdeFavorieten.add(kaartNaam);
          addToFavorites(kaart);
        }
      });

    });

  });