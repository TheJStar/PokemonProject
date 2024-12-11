import CaugthPokemon from "./Backpack.mjs";
import ExternalServices from "./ExternalServices.mjs";
import {
  getParams,
  loadHeaderFooter,
  qs,
} from "./utils.mjs";

const category = "pokemon";
const datasource = new ExternalServices(category);
const caugthPokemon = new CaugthPokemon(datasource, category);

caugthPokemon.init();
loadHeaderFooter(() => {
  const dropdown = qs(".nav-dropdown")
  const nav = qs("nav")

  dropdown.addEventListener("click", () => {
    nav.classList.toggle("wide-appearables");
  })
});