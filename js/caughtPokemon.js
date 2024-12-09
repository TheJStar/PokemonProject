import Backpack from "./Backpack.mjs";
import ExternalServices from "./ExternalServices.mjs";
import {
  getParams,
  loadHeaderFooter,
} from "./utils.mjs";

const category = "pokemon";
const datasource = new ExternalServices(category);
const backpack = new Backpack(datasource, category);

backpack.init();
loadHeaderFooter();