import {createComponentInstance, setupComponent} from "./component";
import {ShapeFlags} from "../shared/ShapeFlags";
import {Fragment, Text} from "./vnode";

export function render(vnode, container) {
    //处理虚拟根节点
    patch(vnode, container, null)
}

function patch(vnode, container, parentComponent) {
    let { type, shapeFlag } = vnode
    switch (type) {
        //Fragment -> 只渲染children(slot)
        case Fragment:
            processFragment(vnode, container, parentComponent)
            break
        case Text:
            processText(vnode, container)
            break
        default:
            //判断虚拟节点时element还是component
            if (shapeFlag & ShapeFlags.ELEMENT) {
                //处理element
                processElement(vnode, container, parentComponent)
            } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                //处理组件
                processComponent(vnode, container, parentComponent)
            }
    }
}

function processComponent(vnode: any, container: any, parentComponent) {
    mountComponent(vnode, container, parentComponent)
}

function processElement(vnode: any, container: any, parentComponent) {
    mountElement(vnode, container, parentComponent)
}

function processFragment(vnode: any, container: any, parentComponent) {
    mountChildren(vnode, container, parentComponent)
}

function processText(vnode: any, container: any) {
    const {children} = vnode
    const textNode = vnode.el = document.createTextNode(children)
    container.append(textNode)
}

function mountComponent(initialVnode: any, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent)
    //处理组件类型的虚拟节点
    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container)
}

/*
* 将vnode转化成真实dom
* */
function mountElement(vnode, container, parentComponent) {
    //将dom元素存储再虚拟节点上
    const el = vnode.el = document.createElement(vnode.type)
    const { children, props, shapeFlag } = vnode
    //判断子节点类型
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN){
        //如果是数组继续用patch转换
        mountChildren(vnode, el, parentComponent)
    }
    for(const key in props) {
        const val = props[key]
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
    container.append(el)
}

function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach(v => {
        patch(v, container, parentComponent)
    })
}
function setupRenderEffect(instance, initialVnode, container) {
    //取出组件vnode的setup代理对象
    const { proxy } = instance
    //将render的this指向proxy
    const subTree = instance.render.call(proxy)
    patch(subTree, container, instance)
    //将element的el赋值给组件vnode
    initialVnode.el = subTree.el
}