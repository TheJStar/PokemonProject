import ExternalServices from "./ExternalServices.mjs";
import { MiscLinks } from "./MiscLink.mjs";
import {
  getParams,
  loadHeaderFooter,
} from "./utils.mjs";


// add an mjs to get moves in a different page
const category = getParams("category")   
const id = getParams("id");
const datasource = new ExternalServices(category);
const page = new MiscLinks(id, category, datasource);

page.init();
loadHeaderFooter();