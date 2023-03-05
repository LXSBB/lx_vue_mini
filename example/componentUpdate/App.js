import { h, ref } from "../../lib/mini-vue.esm.js";

export const App = {
    setup() {
        const count = ref(0)
        const props= ref({
            foo: 'foo',
            bar: 'bar'
        })
        const demo1 = () => {
            props.value.foo = 'new-foo'
        }
        const demo2 = () => {
            props.value.foo = undefined
        }
        const demo3 = () => {
            props.value= {
                foo: 'foo'
            }
        }
        const onClick=() => {
            count.value ++
        }
        return {
            count,
            onClick,
            props,
            demo1,
            demo2,
            demo3,
        }
    },
    render() {
        return h("div", {
            id: "root",
            ...this.props
        },
        [
            h("p", {class:"red"},'count: '+ this.count),
            h('button', {
                onClick: this.onClick
            }, 'click'),
            h('button', {
                onClick: this.demo1
            }, '修改值为新值'),
            h('button', {
                onClick: this.demo2
            }, '修改值为undefined'),
            h('button', {
                onClick: this.demo3
            }, '删除值')
        ]
    )
    }
}