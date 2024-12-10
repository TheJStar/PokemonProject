import CaugthPokemon from "./CaugthPokemon.mjs";
import ExternalServices from "./ExternalServices.mjs";
import {
  getParams,
  loadHeaderFooter,
} from "./utils.mjs";

const category = "pokemon";
const datasource = new ExternalServices(category);
const caugthPokemon = new CaugthPokemon(datasource, category);

caugthPokemon.init();
loadHeaderFooter();