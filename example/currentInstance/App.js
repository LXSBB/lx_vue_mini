import { h, getCurrentInstance } from "../../lib/mini-vue.esm.js";
import {Foo} from "./Foo.js";

window.self = null
export const App = {
    render() {
        window.self = this
        return h("div", {
            id: "root",
            class:['red', 'hard'],
        },
        [
            h("p", {class:"red"},'hi'+ this.msg),
            h(Foo, {})
        ]
    )
    },
    setup() {
        const instance = getCurrentInstance()
        console.log('app:instance', instance)
        return {
            msg: 'mini-vue'
        }
    }
}