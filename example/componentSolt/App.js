import { h } from "../../lib/mini-vue.esm.js";
import {Foo} from "./Foo.js";

window.self = null
export const App = {
    render() {
        window.self = this
        //作用域插槽
        const h1 = ({a}) => h('div', {}, 'header' + a)
        //具名插槽
        const h2 = () => h('div', {}, 'footer1')
        const foo = h(Foo,
            {} ,
            {
                header: h1,
                footer: h2
            }
            )

        return h("div", {
            id: "root",
            class:['red', 'hard'],
        },
        [
            h("p", {class:"red"},'hi'+ this.msg),
            foo
        ]
    )
    },
    setup() {
        return {
            msg: 'mini-vue'
        }
    }
}