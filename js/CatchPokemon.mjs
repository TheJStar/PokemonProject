import { setClick } from "./utils.mjs";
import { setLocalStorage, getLocalStorage, qs, renderWithTemplate, toProperCase } from "./utils.mjs";

export default class CatchPokemon {
    constructor(datasource, category) {
        this.datasource = datasource;
        this.category = category;
        this.pokemon = {};
        this.pokemonSpecies = {};
    }
    async init(selector) {
        //the list is from 1-1025 & 10001-10277
        // make a list of numbers as id to then radomise and get a pokemon
        // also make a random chance things to see if pokemon is shiny (true or fasle) is so add a property (.shiny) to the object to then use to display it
        // add inputs that will be used to change the name of the pokemon
        let index;
        if (this.getRndInteger(1, 100) > 70) {
            index = this.getRndInteger(10001, 10277);
        } else {
            index = this.getRndInteger(1, 1025);
        }
        this.pokemon = await this.datasource.findDataById(index);
        this.pokemonSpecies = await this.datasource.findDataByURL(this.pokemon.species.url);

        //making shinies (or not)
        if (this.getRndInteger(1, 100) > 95) {
            this.pokemon.shiny = true;
        } else {
            this.pokemon.shiny = false;
        }

        this.renderPokemon(selector);

        // pokemon captureing system
        const pokemonToCatch = qs(".pokemon-caught")

        let captureAmount = 3;
        const pokeballAmount = qs("#pokeball-amount")
        pokeballAmount.innerHTML = `Pokeballs: ${captureAmount}`

        const catchButton = qs("#catch");
        catchButton.addEventListener("click", () => {
            if (captureAmount > 0) {
                let captured = this.capturePokemon()
                if (captured) {
                    pokemonToCatch.classList.add("capture")
                    setTimeout(()=>{pokemonToCatch.classList.remove("capture")}, 500)
                    this.reset();
                } else {
                    pokemonToCatch.classList.add("shake")
                    setTimeout(()=>{pokemonToCatch.classList.remove("shake")}, 500)
                }
            } else {
                pokemonToCatch.classList.add("escape")
                setTimeout(()=>{pokemonToCatch.classList.remove("escape");this.reset();}, 500)
            }
            captureAmount--
            pokeballAmount.innerHTML = `Pokeballs: ${captureAmount}`
        })
        const lookAroundButton = qs("#look-around");
        lookAroundButton.addEventListener("click", () => {
            this.reset()
        })
    }
    async renderPokemon(selector) {
        const element = qs(selector);
        element.innerHTML = "";

        let types = `<ul>`
        this.pokemon.types.forEach(type => {
            types += `<li><a href="../moves-abilties/?category=${type.type.url.split("/")[type.type.url.split("/").length - 3]}&id=${type.type.url.split("/")[type.type.url.split("/").length - 2]}" class="${type.type.name}">${type.type.name}</a></li>`
        });
        types += `</ul>`
        
        let img;
        let shinyClass = "";
        if (this.pokemon.sprites.front_default == null) {
            img = "./images/image-missing.png"
        }else{
            if (this.pokemon.shiny) {
                img = this.pokemon.sprites.front_shiny
                shinyClass = "shiny"
            } else {
                img = this.pokemon.sprites.front_default
            }
        }
        const html = `
            <section class="pokemon-caught ${shinyClass}">
                <a href="./pokemon-page/?category=${this.category}&pokemonId=${this.pokemon.id}">
                    <h2>${toProperCase(this.pokemon.name)}</h2>
                    <img 
                        class=""
                        src="${img}"
                        alt="picture of ${this.pokemon.name}"
                    >
                </a>
                <div>
                    <button id="catch">Catch</button>
                    <button id="look-around">Look Around</button>
                </div>
                ${types}
            </section>
        `
        renderWithTemplate(html, element, "beforeEnd")
    }
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    capturePokemon() {
        let backpack = getLocalStorage("backpack");
        const msg = qs("#msg")

        if (!Array.isArray(backpack)) {
            backpack = [];
        }

        
        // catch rate is 1 to 255 the higher the easier
        if (this.getRndInteger(0, 255) < this.pokemonSpecies.capture_rate) {
            backpack.push(this.pokemon);
            msg.innerHTML = `${toProperCase(this.pokemon.name)} captured`
            try {
                setLocalStorage("backpack", backpack)
            } catch (e) {
                console.log(e)
                msg.innerHTML = `Backpack full. Ran out of pokemon space`
            }
            return true
        } else {
            msg.innerHTML = `${toProperCase(this.pokemon.name)} escaped`
            return false
        }
    }
    reset() {
        this.init(".tall-grass")
        const msg = qs("#msg")
        msg.innerHTML = ``
    }
}