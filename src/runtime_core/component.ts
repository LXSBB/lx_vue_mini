import {PublicInstanceProxyHandler} from "./componentPublicInstance";

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
    }
    return component
}

export function setupComponent(instance) {
    //initProps()
    //initSlot()
    setupStatefulComponent(instance)
}


function setupStatefulComponent(instance) {
    const Component = instance.type
    //处理setup
    instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandler)
    const { setup } = Component
    if (setup) {
        const setupResult = setup()
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