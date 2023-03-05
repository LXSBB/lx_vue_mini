import {createRenderer} from "../runtime_core";
// @ts-ignore
export * from '../runtime_core'

//创建元素
function createElement(type) {
 return document.createElement(type)
}

//更新属性
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

//注入元素
function insert(child, parent, anchor) {
    //插入描点anchor的上一位
    parent.insertBefore(child, anchor || null)
}

//删除元素
function remove(child) {
    const parent = child.parentNode
    if (parent) {
        parent.removeChild(child)
    }
}

//设置子节点为text元素
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