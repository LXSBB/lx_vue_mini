import { h, renderSlots } from "../../lib/mini-vue.esm.js";

export const Foo = {
    setup(props, {emit}) {
        return {
        }
    },
    render() {
        const foo = h('p', {}, 'ppppp')
        const a = 10
        return h("div", {}, [
            renderSlots(this.$slots, 'header', {
                a
            }),
            foo,
            renderSlots(this.$slots, 'footer')
        ])
    }
}