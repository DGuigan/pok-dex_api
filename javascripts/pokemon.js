import { buildElement, capitalize } from '/javascripts/utility.js';

// frequesntly used html elements
const pokePane = document.getElementById('pokemon-pane');
const ppName = document.getElementById('pp-name');
const ppImg = document.getElementById('pp-img');
const ppTypes = document.getElementById('pp-types');
const ppStats = document.getElementById('pp-stats');

const baseURL = 'https://pokeapi.co/api/v2/'; //link to API

let pokemonIndex = 0;
let pokemonLimit = 20;
let pokemonList = [];

let nextURL = `${baseURL}pokemon?limit=${pokemonLimit}`;
let previousURL = null;

const spriteKeys = [
                    'front_default', 
                    'back_default', 
                    'front_female', 
                    'back_female', 
                    'front_shiny', 
                    'back_shiny', 
                    'front_shiny_female',
                    'back_shiny_female', 
                ];
let spriteIndex = 0;
let spriteLinks = {};

function displayPokemon(pokemon) {
    console.log(pokemon);
    spriteIndex = 0;
    spriteLinks = pokemon.sprites;
    
    ppImg.src = pokemon.sprites.front_default;
    ppImg.alt = pokemon.name;
    
    ppName.innerHTML = capitalize(pokemon.name);

    ppTypes.innerHTML = '';
    for (let typeObj of pokemon.types) {
        ppTypes.append(buildElement('li', typeObj.type.name));
    }

    for (let statObj of pokemon.stats) {
        document.getElementById(`td-${statObj.stat.name}`).innerHTML = statObj.base_stat;
    }
};

function updatePokemonSprite(step) {
    let loopCount = 0
    do {
        spriteIndex = spriteIndex + step;
        if (spriteIndex < 0) spriteIndex = spriteKeys.length - 1;
        if (spriteIndex >= spriteKeys.length) spriteIndex = 0;
        console.log(`Index: ${spriteIndex}\nLink: ${spriteLinks[spriteKeys[spriteIndex]]}`);
    }
    while (spriteLinks[spriteKeys[spriteIndex]] == null && loopCount++ < spriteKeys.length); //prevent infinite loop in case of no sprites

    ppImg.src = spriteLinks[spriteKeys[spriteIndex]];
};

function loadPokemonList(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            nextURL = data.next;
            previousURL = data.previous;

            pokemonList = data.results;

            resolve();
        });
    });
}

function loadPokemon(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                resolve(data);
            });
    });
}

/* event listeners */

//these are messy...fix later
document.getElementById('inc-pokemon-btn').addEventListener('click', event => {
    if (pokemonIndex < pokemonList.length - 1) {
        let pokemonURL = pokemonList[++pokemonIndex].url;
        loadPokemon(pokemonURL).then(pokemonObj => displayPokemon(pokemonObj));
    }
    else if (pokemonIndex == pokemonList.length - 1 && nextURL) {
        console.log("new list");
        pokemonIndex = 0;
        loadPokemonList(nextURL).then(() => loadPokemon(pokemonList[pokemonIndex].url)).then(pokemonObj => displayPokemon(pokemonObj));
    }
});

document.getElementById('dec-pokemon-btn').addEventListener('click', event => {
    event.preventDefault();
    if (pokemonIndex > 0) {
        let pokemonURL = pokemonList[--pokemonIndex].url;
        loadPokemon(pokemonURL).then(pokemonObj => displayPokemon(pokemonObj));
    }
    else if (pokemonIndex == 0 && previousURL) {
        console.log("new list");
        pokemonIndex = pokemonList.length - 1;
        loadPokemonList(previousURL).then(() => loadPokemon(pokemonList[pokemonIndex].url)).then(pokemonObj => displayPokemon(pokemonObj));
        console.log(pokemonIndex);
    }
});

document.getElementById('next-img-btn').addEventListener('click', event => {
    event.preventDefault();
    updatePokemonSprite(1);
})

document.getElementById('last-img-btn').addEventListener('click', event => {
    event.preventDefault();
    updatePokemonSprite(-1);
})

document.getElementById('pokemon-search-form').addEventListener('submit', event => {
    event.preventDefault();
    let id = document.getElementById('pokemon-search-input').value.toLowerCase();
    loadPokemon(`${baseURL}pokemon/${id}`).then(pokemonObj => displayPokemon(pokemonObj));
})

loadPokemonList(nextURL)
    .then(() => {
        let pokemonURL = pokemonList[pokemonIndex].url;
        loadPokemon(pokemonURL)
            .then(pokemonObj => displayPokemon(pokemonObj));
    })
