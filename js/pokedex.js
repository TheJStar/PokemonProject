import ExternalServices from "./ExternalServices.mjs";
import PokemonList from "./PokemonList.mjs";
import {
  getParams,
  loadHeaderFooter,
} from "./utils.mjs";

const category = "pokemon"    
const datasource = new ExternalServices(category);
const pokemon = new PokemonList(datasource, 1000, 1302, category);

pokemon.init();
loadHeaderFooter();