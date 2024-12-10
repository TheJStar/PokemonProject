import { setClick } from "./utils.mjs";
import { setLocalStorage, getLocalStorage, qs, renderWithTemplate, toProperCase } from "./utils.mjs";

export default class CaugthPokemon {
    constructor(datasource, category) {
        this.datasource = datasource;
        this.category = category;
        this.pokemons = [];
    }
    async init() {
        //the list is from 1-1025 & 10001-10277
        this.pokemons = getLocalStorage("caugth-pokemon") || [];
        const main = qs("main");
        // makes a grid (remove later and change the media size in css)
        main.style.display = "grid";
        // main.style.gap = "1rem"
        main.style.gridTemplateColumns = "repeat( auto-fill, minmax(176px, 1fr) )";

        this.renderPokemons("main");
    }
    async renderPokemons(selector) {
        const element = qs(selector);

        this.pokemons.forEach(async pokemon => {
            let types = `<ul>`
            pokemon.types.forEach(type => {
                //maybe remove the link from here
                types += `<li><a href="../moves-abilties/?category=${type.type.url.split("/")[type.type.url.split("/").length - 3]}&id=${type.type.url.split("/")[type.type.url.split("/").length - 2]}" class="${type.type.name}">${type.type.name}</a></li>`
            });
            types += `</ul>`
            
            let img;
            if (pokemon.sprites.front_default == null) {
                img = "../images/image-missing.png"
            }else{
                if (pokemon.shiny) {
                    img = pokemon.sprites.front_shiny
                } else {
                    img = pokemon.sprites.front_default
                }
            }
            const html = `
                <section class="pokemon-cards">
                    <a href="../pokemon-page/?category=${this.category}&pokemonId=${pokemon.id}">
                        <h2>${toProperCase(pokemon.name)}</h2>
                        <img 
                            class=""
                            src="${img}"
                            alt="picture of ${pokemon.name}"
                        >
                    </a>
                    ${types}
                </section>
            `
            renderWithTemplate(html, element, "beforeEnd")
        }); 
    }
}