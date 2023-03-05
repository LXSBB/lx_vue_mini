import {h, ref} from "../../lib/mini-vue.esm.js";

//左侧对比
// (a b) c
// (a b) d e
const prevChildren = [
    h('div', {key: 'A'}, 'A'),
    h('div', {key: 'B'}, 'B'),
    h('div', {key: 'C'}, 'C'),
]
const nextChildren = [
    h('div', {key: 'A'}, 'A'),
    h('div', {key: 'B'}, 'B'),
    h('div', {key: 'D'}, 'D'),
    h('div', {key: 'D'}, 'D'),
]


export const ArrayToArray = {
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