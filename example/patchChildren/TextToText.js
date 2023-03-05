import {h, ref} from "../../lib/mini-vue.esm.js";

const nextChildren = 'newChildren'
const prevChildren = 'oldChildren'

export const TextToText = {
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