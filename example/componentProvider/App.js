import { h,provide,inject } from "../../lib/mini-vue.esm.js";

//父级
const Provider = {
    name: 'Provider',
    setup() {
        provide('foo','fooVal')
        provide('bar','barVal')
    },
    render() {
        return h('div', {}, [
            h('p',{},'provider'),
            h(ProviderTwo)
        ]);
    }
}

const ProviderTwo = {
    name: 'ProviderTwo',
    setup() {
        //定义自己的foo
        provide('foo', 'fooTwo')
        //获取此组件父级的foo
        const foo = inject('foo')
        return {
            foo
        }
    },
    render() {
        return h('div', {}, [
            h('p',{},'ProviderTwo- ' + this.foo),
            h(Consumer)
        ]);
    }
}

//子级
const Consumer = {
    name: 'Consumer',
    setup() {
        const foo = inject('foo')
        const bar = inject('bar')
        //如果没有inject值,可以设置默认值
        const baz = inject('baz', 'bazDefault')
        const baf = inject('baf', () => 'bafDefault')
        return {
            bar,
            foo,
            baz,
            baf
        }
    },
    render() {
        return h('div', {}, `consumer - ${this.bar} - ${this.foo} - ${this.baz} - ${this.baf} `)
    }
}

export const App = {
    render() {
        window.self = this
        return h("div", {},
        [
            h("p", {class:"red"},'hi'+ this.msg),
            h(Provider)
        ]
    )
    },
    setup() {
        return {
            msg: 'mini-vue'
        }
    }
}