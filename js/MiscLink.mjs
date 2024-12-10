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
        let text = "";
        if (this.page.hasOwnProperty("effect_entries")) {
            this.page.effect_entries.forEach(element => {
                if (element.language.name === "en") {
                    text += element.effect
                }
            });
        } else if (this.page.hasOwnProperty("flavor_text_enteries")){
            text += this.page.flavor_text_enteries[0]
        }

        const html = `
            <h3>${toProperCase(this.category)}</h3>
            <h2>${toProperCase(this.page.name)}</h2>
            <p class="divider">${text}</p>
            <p>Open the page inspector to see the object in the console</p>
        `
        renderWithTemplate(html, element)
    }
}