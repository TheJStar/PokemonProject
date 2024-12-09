import { setClick } from "./utils.mjs";
import { setLocalStorage, getLocalStorage, qs, renderWithTemplate, toProperCase } from "./utils.mjs";

export default class PokemonList {
    constructor(datasource, offset, limit, category) {
        this.datasource = datasource;
        this.category = category;
        this.offset = offset;
        this.limit= limit;
        this.pokemons = [];
    }
    async init() {
        //the list is from 1-1025 & 10001-10277
        this.pokemons = await this.datasource.getData(this.category, this.offset, this.limit);
        const main = qs("main");
        // makes a grid (remove later and change the media size in css)
        main.style.display = "grid";
        // main.style.gap = "1rem"
        main.style.gridTemplateColumns = "repeat( auto-fill, minmax(176px, 1fr) )";

        this.pokemonPages(".pages", 75);
        this.renderPokemons("main");
    }
    async renderPokemons(selector) {
        const element = qs(selector);

        this.pokemons.results.forEach(async pokemonDetails => {
            const pokemon = await this.datasource.findDataByURL(pokemonDetails.url)

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
                img = pokemon.sprites.front_default
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
    async renderPokemonsBySearch(selector, value) {
        this.pokemons = await this.datasource.getData(this.category, 0, this.pokemons.count);
        const element = qs(selector);
        element.innerHTML = "";

        if (value.trim() != "") {
            element.innerHTML = "";
            this.pokemons.results.forEach(async pokemonDetails => {
                const pokemon = await this.datasource.findDataByURL(pokemonDetails.url)
    
                if (pokemon.name.toUpperCase().includes(value.toUpperCase())) {
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
                        img = pokemon.sprites.front_default
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
                }
            });
        } else if (value.trim() == "") {
            element.innerHTML= ""
            this.pokemons = await this.datasource.getData(this.category, this.offset, this.limit);
            this.renderPokemons("main")
        }
    }
    pokemonPages(selector, pageLength) {
        const element = qs(selector)

        let html = `<ul>`;
        for (let i = 0; i < (this.pokemons.count/pageLength); i++) {
            html += `<li><a href="../pokedex/?offset=${i*pageLength}&limit=${(i+1)*pageLength}">${i+1}</a></li>`
        }
        html += `</ul>`;
        renderWithTemplate(html, element, "afterBegin")
    }
}