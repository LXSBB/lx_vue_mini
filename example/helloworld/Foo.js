import { h } from "../../lib/mini-vue.esm.js";

export const Foo = {
    setup(props, {emit}) {
        // props.count++
        // console.log(props)
        const emitAdd = () => {
            emit('add',1)
            emit('add-two',2)
        }
        return {
            emitAdd
        }
    },
    render() {
        const btn = h('button',{
            onClick: this.emitAdd
        },'editAdd')
        return h("div", {}, [btn])
    }
}