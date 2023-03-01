import {PublicInstanceProxyHandler} from "./componentPublicInstance";
import {initProps} from "./componentProps";
import {shallowReadonly} from "../reactivity/reactive";

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {}
    }
    return component
}

export function setupComponent(instance) {
    //处理组件虚拟节点的props
    initProps(instance, instance.vnode.props)
    //initSlot()
    setupStatefulComponent(instance)
}


function setupStatefulComponent(instance) {
    const Component = instance.type
    //处理setup
    instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandler)
    const { setup } = Component
    if (setup) {
        //获取setup返回值
        //给setup传入props参数,因为只有props外层是响应式,所以包裹shallowReadonly
        const setupResult = setup(shallowReadonly(instance.props))
        handleSetupResult(instance, setupResult)
    }
}

function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult
    }
    finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
    const Component = instance.type
    if (Component.render) {
        instance.render = Component.render
    }
}