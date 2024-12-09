import ExternalServices from "./ExternalServices.mjs";
import PokemonList from "./PokemonList.mjs";
import {
  getParams,
  loadHeaderFooter,
} from "./utils.mjs";

const offset = getParams("offset")
const limit = getParams("limit")
const category = "pokemon"    
const datasource = new ExternalServices(category);
const pokemon = new PokemonList(datasource, offset, limit, category);

const searchbar = document.querySelector("#search");

pokemon.init();
loadHeaderFooter();

searchbar.addEventListener("change", async ()=> {
    pokemon.renderPokemonsBySearch("main", searchbar.value);
})