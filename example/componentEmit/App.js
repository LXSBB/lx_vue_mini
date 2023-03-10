import { h } from "../../lib/mini-vue.esm.js";
import {Foo} from "./Foo.js";

window.self = null
export const App = {
    render() {
        window.self = this
        return h("div", {
            id: "root",
            class:['red', 'hard'],
            // onClick() {
            //     console.log('click')
            // },
            // onMousedown() {
            //     console.log('mouseDown')
            // }
        },
        [
            h("p", {class:"red"},'hi'+ this.msg),
            h(Foo, {
                count: 1,
                onAdd(a) {
                    console.log('onAdd',a)
                },
                onAddTwo(b){
                    console.log('onAddTwo',b)
                }
            })
        ]
    )
    },
    setup() {
        return {
            msg: 'mini-vue'
        }
    }
}