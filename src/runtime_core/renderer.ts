import {createComponentInstance, setupComponent} from "./component";
import { isObject } from "../shared";
import {ShapeFlags} from "../shared/ShapeFlags";

export function render(vnode, container) {
    //处理虚拟节点
    patch(vnode, container)
}

function patch(vnode, container) {
    let { shapeFlag } = vnode
    //判断虚拟节点时element还是component
    if (shapeFlag & ShapeFlags.ELEMENT) {
        //处理element
        processElement(vnode, container)
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        //处理组件
        processComponent(vnode, container)
    }

}

function processComponent(vnode: any, container: any) {
    mountComponent(vnode, container)
}

function processElement(vnode: any, container: any) {
    mountElement(vnode, container)
}


function mountComponent(initialVnode: any, container) {
    const instance = createComponentInstance(initialVnode)
    //处理组件类型的虚拟节点
    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container)
}

/*
* 将vnode转化成真实dom
* */
function mountElement(vnode, container) {
    //将dom元素存储再虚拟节点上
    const el = vnode.el = document.createElement(vnode.type)
    const { children, props, shapeFlag } = vnode
    //判断子节点类型
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN){
        //如果是数组继续用patch转换
        mountChildren(vnode, el)
    }
    for(const key in props) {
        const val = props[key]
        el.setAttribute(key, val)
    }
    container.append(el)
}

function mountChildren(vnode, container) {
    vnode.children.forEach(v => {
        patch(v, container)
    })
}
function setupRenderEffect(instance, initialVnode, container) {
    //取出组件vnode的setup代理对象
    const { proxy } = instance
    const subTree = instance.render.call(proxy)
    patch(subTree, container)
    //将element的el赋值给组件vnode
    initialVnode.el = subTree.el
}