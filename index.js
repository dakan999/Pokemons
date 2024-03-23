const pokemonContainer = document.getElementById('pokemonContainer');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const searchInput = document.getElementById('searchInput');

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

async function displayAllPokemons() {
    try {
        const pokemonResponse = await fetchData('https://pokeapi.co/api/v2/pokemon/?limit=100');
        const pokemons = pokemonResponse.results;

        for (const pokemon of pokemons) {
            const pokemonData = await fetchData(pokemon.url);

            const pokemonElement = document.createElement('div');
            pokemonElement.classList.add('pokemon');

            const img = document.createElement('img');
            img.src = pokemonData.sprites.front_default;
            img.alt = pokemonData.name;
            pokemonElement.appendChild(img);

            const details = document.createElement('div');
            details.classList.add('pokemon-details');

            const name = document.createElement('h2');
            name.textContent = pokemonData.name;
            details.appendChild(name);

            const types = document.createElement('p');
            types.textContent = 'Types: ' + pokemonData.types.map(type => type.type.name).join(', ');
            details.appendChild(types);

            const abilities = document.createElement('p');
            abilities.textContent = 'Abilities: ' + pokemonData.abilities.map(ability => ability.ability.name).join(', ');
            details.appendChild(abilities);

            pokemonElement.appendChild(details);

            pokemonElement.addEventListener('click', () => {
                displayModal(pokemonData);
            });

            pokemonContainer.appendChild(pokemonElement);
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function displayModal(pokemonData) {
    modal.style.display = 'block';
    modalContent.innerHTML = `
        <h2>${pokemonData.name}</h2>
        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
        <p>Types: ${pokemonData.types.map(type => type.type.name).join(', ')}</p>
        <p>Abilities: ${pokemonData.abilities.map(ability => ability.ability.name).join(', ')}</p>
        <p>Height: ${pokemonData.height}</p>
        <p>Weight: ${pokemonData.weight}</p>
        <p>Base Experience: ${pokemonData.base_experience}</p>
    `;

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.textContent = 'Close';
    modalContent.appendChild(closeButton);

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

displayAllPokemons();

searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();
    const pokemons = document.querySelectorAll('.pokemon');

    pokemons.forEach(pokemon => {
        const name = pokemon.querySelector('h2').textContent.toLowerCase();
        if (name.includes(searchValue)) {
            pokemon.style.display = 'block';
        } else {
            pokemon.style.display = 'none';
        }
    });
});
