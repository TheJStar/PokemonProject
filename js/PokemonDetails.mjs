import { setClick } from "./utils.mjs";
import { setLocalStorage, getLocalStorage, qs, renderWithTemplate, toProperCase } from "./utils.mjs";

export default class PokemonDetails {
    constructor(pokemonId, datasource) {
        this.pokemonId = pokemonId;
        this.datasource = datasource;
        this.pokemon = {};
        this.pokemonSpecies = {};
        this.pokemonEvoChain = {};
        this.pokemonMoves = {};
        this.pokemonLocation = {};
    }
    async init() {
        this.pokemon = await this.datasource.findDataById(this.pokemonId);
        this.pokemonSpecies = await this.datasource.findDataByURL(this.pokemon.species.url);
        this.pokemonEvoChain = await this.datasource.findDataByURL(this.pokemonSpecies.evolution_chain.url);
        this.pokemonLocation = await this.datasource.findDataByURL(this.pokemon.location_area_encounters);
        this.renderPokemonDetails("main");

        this.extendOrCollaps();

        const favorite = qs("#fav")
        favorite.addEventListener("click", () => {
            favorite.classList.toggle("notfavorite")
            favorite.classList.toggle("favorite")
            this.addToFavorites();
        })

        console.log(this.pokemon);
        //console.log(this.pokemonEvoChain.chain.species.name)// this is what you should use to catch pokemon because you don't find eveloved stuff in some areas maybe
        //console.log(this.pokemonSpecies.flavor_text_entries.length) // make the flavor text choosable by a drop down maybe
        //console.log(this.pokemonSpecies.flavor_text_entries[0].flavor_text); // the index is the flavor text version controler
        //console.log(this.pokemonEvoChain); // get the evolution chain
    }
    async renderPokemonDetails(selector) {
        const element = qs(selector);

        let types = `<ul class="collapsed">`
        this.pokemon.types.forEach(type => {
            types += `<li>
                <a href="../moves-abilties/?category=${type.type.url.split("/")[type.type.url.split("/").length - 3]}&id=${type.type.url.split("/")[type.type.url.split("/").length - 2]}">
                    ${type.type.name}
                </a>
            </li>`
        });
        types += `</ul>`
        let abilities = `<ul class="collapsed">`
        this.pokemon.abilities.forEach(ability => {
            abilities += `<li>
                <a href="../moves-abilties/?category=${ability.ability.url.split("/")[ability.ability.url.split("/").length - 3]}&id=${ability.ability.url.split("/")[ability.ability.url.split("/").length - 2]}">
                    ${ability.ability.name}
                </a>
            </li>`
        });
        abilities += `</ul">`
        let moves = `<ul class="collapsed">`
        this.pokemon.moves.forEach(move => {
            moves += `<li>
                <a href="../moves-abilties/?category=${move.move.url.split("/")[move.move.url.split("/").length - 3]}&id=${move.move.url.split("/")[move.move.url.split("/").length - 2]}">
                    ${move.move.name}
                </a>
            </li>`
        });
        moves += `</ul>`
        let stats = `<ul class="collapsed">`
        this.pokemon.stats.forEach(stat => {
            stats += `<li>
                ${toProperCase(stat.stat.name)}: ${stat.base_stat} - Effort: ${stat.effort}
            </li>`
        });
        stats += `</ul>`
        let locations = `<ul class="collapsed">`
        this.pokemonLocation.forEach(location => {
            locations += `<li>
                <a href="../moves-abilties/?category=${location.location_area.url.split("/")[location.location_area.url.split("/").length - 3]}&id=${location.location_area.url.split("/")[location.location_area.url.split("/").length - 2]}">
                ${toProperCase(location.location_area.name)}
                </a>
            </li>`
        });
        locations += `</ul>`


        let sprites = `<ul class="collapsed">`
        for (let key in this.pokemon.sprites) {
            if (key != "other" && key != "version") {
                sprites += `<li>
                    ${key}: ${this.pokemon.sprites[key]}
                </li>`
            }
        }
        sprites += `</ul>`

        let evo = this.pokemonEvoChain.chain
        let evoChain = `<ul class="collapsed">`
        evoChain += `<li>
            <a href="../pokemon-page/?category=${"pokemon"}&pokemonId=${evo.species.url.split("/")[evo.species.url.split("/").length - 2]}">
                ${evo.species.name}
            </a>
        </li>`
        while (evo.evolves_to.length > 0) {
            evoChain += `<li>
                <a href="../pokemon-page/?category=${"pokemon"}&pokemonId=${evo.evolves_to[0].species.url.split("/")[evo.evolves_to[0].species.url.split("/").length - 2]}">
                    ${evo.evolves_to[0].species.name}
                </a>
            </li>`
            evo = evo.evolves_to[0]
        }
        evoChain += `</ul>`

        let img;
        if (this.pokemon.sprites.front_default == null) {
            img = "../images/image-missing.png"
        }else{
            if (this.pokemon.shiny) {
                img = this.pokemon.sprites.front_shiny
            } else {
                img = this.pokemon.sprites.front_default
            }
        }

        let inBackpack = "notfavorite";
        if (this.checkBackpack()) {
            inBackpack = "favorite"
        } else {
            inBackpack = "notfavorite"
        }
        const html = `
            <section class="pokemon-detail">
                <h2>${toProperCase(this.pokemon.name)}<button id="fav" class="${inBackpack}">Favorite</button></h2>

                <img
                class=""
                src="${img}"
                alt="picture of ${this.pokemon.name}"
                />

                <div class="block">
                    <h4>Flavor Text</h4> 
                    <p class="">${this.pokemonSpecies.flavor_text_entries[0].flavor_text}</p>
                    <p class="">Height: ${this.pokemon.height/10}m</p>
                    <p class="">Weight: ${this.pokemon.weight/10}kg</p>
                    <p class="">Capture Rate: ${this.pokemonSpecies.capture_rate}kg</p>
                    <p class="">Capture Rate: ${this.pokemon.base_experience}kg</p>
                </div>
                <div class="collapsible">
                    <h4 class="extend">Sprites</h4>
                    ${sprites}
                </div>
                <div class="collapsible">
                    <h4 class="extend">Type</h4>
                    ${types}
                </div>
                <div class="collapsible">
                    <h4 class="extend">Evolution Chain</h4>
                    ${evoChain}
                </div>
                <div class="collapsible">
                    <h4 class="extend">Stats</h4>
                    ${stats}
                </div>                
                <div class="collapsible">
                    <h4 class="extend">Abilities</h4>
                    ${abilities}
                </div>
                <div class="collapsible">
                    <h4 class="extend">Moves</h4>
                    ${moves}
                </div>
                <div class="collapsible">
                    <h4 class="extend">Encounter Locations</h4>
                    ${locations}
                </div>  
            </section>
        ` // you can get flavor text and evolution chain from versions in the /pokemon-species/id/
        renderWithTemplate(html, element)
    }
    extendOrCollaps() {
        const coll = document.querySelectorAll(".collapsible");

        coll.forEach(element => {
            element.children[0].addEventListener("click", () => {
                // if (element.children[1].style.display === "none") {
                //     element.children[1].style.display = "block"
                // } else {
                //     element.children[1].style.display = "none"
                // }
                element.children[1].classList.toggle("collapsed");

                element.children[0].classList.toggle("collaps");
                element.children[0].classList.toggle("extend");
            })
        }); 
    }
    addToFavorites() {
        let backpack = getLocalStorage("backpack");

        if (!Array.isArray(backpack)) {
            backpack = [];
        }

        if (!this.checkBackpack()) {
            backpack.push(this.pokemon)
        } else {
            let i = 0;
            while (i < backpack.length && backpack[i].id != this.pokemon.id) {
                i++
            }
            if (i < backpack.length) {
                backpack.splice(i, 1)
            }
        }
        setLocalStorage("backpack", backpack)
    }
    checkBackpack(key="backpack") {
        let backpack = getLocalStorage(key);

        if (!Array.isArray(backpack)) {
            backpack = [];
        }
        return backpack.some((obj) => obj.id === this.pokemon.id)
    }
    isShiny(key, poke) {
        // if you caught a shiny version of it it will show shiny in the pokemon details page
        let backpack = getLocalStorage(key);
        let shiny = false;
        if (!Array.isArray(backpack)) {
            backpack = [];
        }
        backpack.forEach(obj => {
            if (obj.id === poke.id) {
                if (obj.shiny) {
                    shiny = true
                    return shiny
                }
            }
        });
        return shiny
    }
}