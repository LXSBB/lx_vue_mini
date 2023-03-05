import {createRenderer} from "../runtime_core";
// @ts-ignore
export * from '../runtime_core'

function createElement(type) {
 return document.createElement(type)
}

function patchProp(el, key, prevVal, nextVal) {
    //判断属性是否是个事件
    const isOn = (key) => /^on[A-Z]/.test(key)
    if (isOn(key)) {
        //添加事件
        const event = key.slice(2).toLowerCase()
        el.addEventListener(event, nextVal)
    } else {
        if (nextVal === undefined || nextVal === null) {
            el.removeAttribute(key)
        } else {
            el.setAttribute(key, nextVal)
        }
    }
}

function insert(el, container) {
    container.append(el)
}

//删除子节点
function remove(child) {
    const parent = child.parentNode
    if (parent) {
        parent.removeChild(child)
    }
}

//设置子节点为text
function setElementText(el, text) {
    el.textContent = text
}

const renderer: any = createRenderer({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText
})

export function createApp(...args) {
    return renderer.createApp(...args)
}