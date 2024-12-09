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
    }
    async init() {
        this.pokemon = await this.datasource.findDataById(this.pokemonId);
        this.pokemonSpecies = await this.datasource.findDataByURL(this.pokemon.species.url);
        this.pokemonEvoChain = await this.datasource.findDataByURL(this.pokemonSpecies.evolution_chain.url);
        this.renderPokemonDetails("main");

        this.extendOrCollaps();
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
            types += `<li><a href="../moves-abilties/?category=${type.type.url.split("/")[type.type.url.split("/").length - 3]}&id=${type.type.url.split("/")[type.type.url.split("/").length - 2]}">${type.type.name}</a></li>`
        });
        types += `</ul>`
        let abilities = `<ul class="collapsed">`
        this.pokemon.abilities.forEach(ability => {
            abilities += `<li><a href="../moves-abilties/?category=${ability.ability.url.split("/")[ability.ability.url.split("/").length - 3]}&id=${ability.ability.url.split("/")[ability.ability.url.split("/").length - 2]}">${ability.ability.name}</a></li>`
        });
        abilities += `</ul">`
        let moves = `<ul class="collapsed">`
        this.pokemon.moves.forEach(move => {
            moves += `<li><a href="../moves-abilties/?category=${move.move.url.split("/")[move.move.url.split("/").length - 3]}&id=${move.move.url.split("/")[move.move.url.split("/").length - 2]}">${move.move.name}</a></li>`
        });
        moves += `</ul>`
        let stats = `<ul class="collapsed">`
        this.pokemon.stats.forEach(stat => {
            stats += `<li>${toProperCase(stat.stat.name)}: ${stat.base_stat} - Effort: ${stat.effort}</li>`
        });
        stats += `</ul>`

        let img;
        if (this.pokemon.sprites.front_default == null) {
            img = "../images/image-missing.png"
        }else{
            img = this.pokemon.sprites.front_default
        }
        const html = `
            <section class="pokemon-detail">
                <h2>${toProperCase(this.pokemon.name)}</h2>

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
                </div>
                <div class="collapsible">
                    <h4 class="extend">Type</h4>
                    ${types}
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
}