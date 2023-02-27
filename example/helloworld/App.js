import { h } from "../../lib/mini-vue.esm.js";

window.self = null
export const App = {
    render() {
        window.self = this
        return h("div", {
            id: "root",
            class:['red', 'hard'],
            onClick() {
                console.log('click')
            },
            onMousedown() {
                console.log('mouseDown')
            }
        },
            this.msg
        // [
        //     h("p", {class:"red"},'hi'),
        //     h("p", {class:"blue"}, 'vue')
        // ]
    )
    },
    setup() {
        return {
            msg: 'mini-vue'
        }
    }
}