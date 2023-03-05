import {h, ref} from "../../lib/mini-vue.esm.js";

const nextChildren = [
    h('div', {}, 'A'),
    h('div', {}, 'B'),
]
const prevChildren = 'oldChildren'

export const TextToArray = {
    setup(props, {emit}) {
        const isChange = ref(false)
        window.isChange = isChange
        return {
            isChange
        }
    },
    render() {
        const self = this
        return self.isChange === true ?
            h("div", {}, nextChildren):
            h("div", {}, prevChildren)
    }
}