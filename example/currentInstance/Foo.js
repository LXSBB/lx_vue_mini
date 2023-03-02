import { h, getCurrentInstance } from "../../lib/mini-vue.esm.js";

export const Foo = {
    setup(props, {emit}) {
        const instance = getCurrentInstance()
        console.log('foo:instance', instance)
        return {
        }
    },
    render() {
        return h("div", {}, '111')
    }
}