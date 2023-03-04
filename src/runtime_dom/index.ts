import {createRenderer} from "../runtime_core";
// @ts-ignore
export * from '../runtime_core'

function createElement(type) {
 return document.createElement(type)
}

function patchProp(el, key, val) {
    //判断属性是否是个事件
    const isOn = (key) => /^on[A-Z]/.test(key)
    if (isOn(key)) {
        //添加事件
        const event = key.slice(2).toLowerCase()
        el.addEventListener(event, val)
    } else {
        el.setAttribute(key, val)
    }
}

function insert(el, container) {
    container.append(el)
}

const renderer: any = createRenderer({
    createElement,
    patchProp,
    insert
})

export function createApp(...args) {
    return renderer.createApp(...args)
}