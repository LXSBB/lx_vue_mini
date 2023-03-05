import {h, ref} from "../../lib/mini-vue.esm.js";

//左侧对比
// (a b) c
// (a b) d e
// const prevChildren = [
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
//     h('div', {key: 'C'}, 'C'),
// ]
// const nextChildren = [
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
//     h('div', {key: 'D'}, 'D'),
//     h('div', {key: 'E'}, 'E'),
// ]
//右侧对比
//   a (b c)
// d e (b c)
// const prevChildren = [
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
//     h('div', {key: 'C'}, 'C'),
// ]
// const nextChildren = [
//     h('div', {key: 'D'}, 'D'),
//     h('div', {key: 'E'}, 'E'),
//     h('div', {key: 'B'}, 'B'),
//     h('div', {key: 'C'}, 'C'),
// ]
// 新值比旧值长-左侧
// (a b)
// (a b) c
// const prevChildren = [
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
// ]
// const nextChildren = [
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
//     h('div', {key: 'C'}, 'C'),
// ]
// 新值比旧值长-右侧
//     (a b)
// d c (a b)
const prevChildren = [
    h('div', {key: 'A'}, 'A'),
    h('div', {key: 'B'}, 'B'),
]
const nextChildren = [
    h('div', {key: 'D'}, 'D'),
    h('div', {key: 'C'}, 'C'),
    h('div', {key: 'A'}, 'A'),
    h('div', {key: 'B'}, 'B'),
]
// 新值比旧值短-左侧
// (a b) c
// (a b)
// const prevChildren = [
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
//     h('div', {key: 'C'}, 'C'),
// ]
// const nextChildren = [
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
// ]
// 新值比旧值长-右侧
// c (a b)
//   (a b)
// const prevChildren = [
//     h('div', {key: 'C'}, 'C'),
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
// ]
// const nextChildren = [
//     h('div', {key: 'A'}, 'A'),
//     h('div', {key: 'B'}, 'B'),
// ]

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