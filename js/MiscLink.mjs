import { setClick } from "./utils.mjs";
import { setLocalStorage, getLocalStorage, qs, renderWithTemplate, toProperCase } from "./utils.mjs";

export class MiscLinks {
    constructor(id, category, datasource) {
        this.id = id;
        this.category = category;
        this.datasource = datasource;
        this.page = {}
    }
    async init() {
        this.page = await this.datasource.findDataById(this.id, this.category);
        console.log(this.page)
        this.renderPage("main");
    }
    renderPage(selector) {
        const element = qs(selector);

        const html = `
            <h3>${toProperCase(this.category)}</h3>
            <h2>${toProperCase(this.page.name)}</h2>
            <p>Open the page inspector to see the object in the console</p>
        `
        renderWithTemplate(html, element)
    }
}