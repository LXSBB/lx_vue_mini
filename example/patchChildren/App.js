import { h } from "../../lib/mini-vue.esm.js";
import {ArrayToText} from "./ArrayToText.js";
import {TextToText} from "./TextToText.js";
import {TextToArray} from "./TextToArray.js";

window.self = null
export const App = {
    render() {
        window.self = this
        return h("div", {
            id: "root",
        },
        [
            h("p", {class:"red"},'主页'),
            //h(ArrayToText)
            //h(TextToText)
            h(TextToArray)
        ]
    )
    },
    setup() {
    }
}