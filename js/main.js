import CatchPokemon from "./CatchPokemon.mjs";
import ExternalServices from "./ExternalServices.mjs";
import {
  getParams,
  loadHeaderFooter,
  qs,
  loadHeaderFooterMain,
} from "./utils.mjs";

const category = "pokemon"
const datasource = new ExternalServices(category);
const catchPokemon = new CatchPokemon(datasource, category);
const button = document.querySelector("#catch");

catchPokemon.init(".tall-grass");
loadHeaderFooterMain();