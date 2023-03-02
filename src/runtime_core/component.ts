import {PublicInstanceProxyHandler} from "./componentPublicInstance";
import {initProps} from "./componentProps";
import {shallowReadonly} from "../reactivity/reactive";
import {emit} from "./componentEmit";
import {initSlot} from "./componentSlots";

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: () => {}
    }
    component.emit = (emit as any).bind(null, component)
    return component
}

export function setupComponent(instance) {
    //处理组件虚拟节点的props
    initProps(instance, instance.vnode.props)
    // 初始化组件插槽
    initSlot(instance, instance.vnode.children)
    setupStatefulComponent(instance)
}


function setupStatefulComponent(instance) {
    const Component = instance.type
    //处理setup
    instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandler)
    const { setup } = Component
    if (setup) {
        //当调用setup时给currentInstance赋值
        setCurrentInstance(instance)
        //获取setup返回值
        //给setup传入props参数,因为只有props外层是响应式,所以包裹shallowReadonly
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        })
        //执行完setup后清空currentInstance
        setCurrentInstance(null)
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

let currentInstance = null
export function getCurrentInstance() {
    return currentInstance
}

function setCurrentInstance(instance) {
    currentInstance = instance
}