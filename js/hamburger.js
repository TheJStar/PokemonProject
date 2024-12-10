import { qs } from "./utils.mjs"

const dropdown = document.querySelector(".nav-dropdown")
const nav = qs("nav")

console.log(dropdown)
if (dropdown != null) {
    dropdown.addEventListener("click", () => {
        nav.classList.toggle("collapsed");
        console.log("clicked")
    })
}