import ExternalServices from "./ExternalServices.mjs";
import PokemonDetails from "./PokemonDetails.mjs";
import {
  getParams,
  loadHeaderFooter,
} from "./utils.mjs";

const category = "pokemon"    
const pokemonId = getParams("pokemonId");
const datasource = new ExternalServices(category);
const pokemon = new PokemonDetails(pokemonId, datasource);

pokemon.init();
loadHeaderFooter();