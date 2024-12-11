import Favorites from "./Favorites.mjs";
import ExternalServices from "./ExternalServices.mjs";
import {
  getParams,
  loadHeaderFooter,
  qs,
} from "./utils.mjs";

const category = "pokemon";
const datasource = new ExternalServices(category);
const backpack = new Favorites(datasource, category);

backpack.init();
loadHeaderFooter(() => {
  const dropdown = qs(".nav-dropdown")
  const nav = qs("nav")

  dropdown.addEventListener("click", () => {
    nav.classList.toggle("wide-appearables");
  })
});