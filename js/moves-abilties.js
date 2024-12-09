import ExternalServices from "./ExternalServices.mjs";
import PokemonDetails from "./PokemonDetails.mjs";
import {
  getParams,
  loadHeaderFooter,
} from "./utils.mjs";


// add an mjs to get moves in a different page
const category = "move"    
const moveId = getParams("moveId");
const datasource = new ExternalServices(category);
const pokemon = new PokemonDetails(moveId, datasource);

pokemon.init();
loadHeaderFooter();