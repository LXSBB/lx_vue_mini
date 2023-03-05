import {createComponentInstance, setupComponent} from "./component";
import {ShapeFlags} from "../shared/ShapeFlags";
import {Fragment, Text} from "./vnode";
import {createAppAPI} from "./createApp";
import {effect} from "../reactivity/effect";

export function createRenderer(options) {
    const { createElement, patchProp, insert } = options

    function render(vnode, container) {
        //处理虚拟根节点
        patch(null, vnode, container, null)
    }

    /**
     * 渲染节点数据
     * @param n1 旧的节点数据
     * @param n2 新的节点数据
     * @param container 父节点dom
     * @param parentComponent 父级节点数据
     * */
    function patch(n1, n2, container, parentComponent) {
        let { type, shapeFlag } = n2
        switch (type) {
            //Fragment -> 只渲染children(slot)
            case Fragment:
                processFragment(n1, n2, container, parentComponent)
                break
            case Text:
                processText(n1, n2, container)
                break
            default:
                //判断虚拟节点时element还是component
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    //处理element
                    processElement(n1, n2, container, parentComponent)
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    //处理组件
                    processComponent(n1, n2, container, parentComponent)
                }
        }
    }

    function processComponent(n1, n2, container: any, parentComponent) {
        mountComponent(n2, container, parentComponent)
    }

    function processElement(n1, n2, container: any, parentComponent) {
        if (!n1) {
            //init
            mountElement(n2, container, parentComponent)
        } else {
            //update
            patchElement(n1, n2, container)
        }
    }

    function processFragment(n1, n2, container: any, parentComponent) {
        mountChildren(n2, container, parentComponent)
    }

    function processText(n1, n2, container: any) {
        const {children} = n2
        const textNode = n2.el = document.createTextNode(children)
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
        const el = vnode.el = createElement(vnode.type)
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
            //统一处理属性
            patchProp(el, key, val)
        }
        //统一append
        insert(el, container)
    }

    //更新element
    function patchElement(n1, n2, container) {
        console.log(n1, n2)
    }

    function mountChildren(vnode, container, parentComponent) {
        vnode.children.forEach(v => {
            patch(null, v, container, parentComponent)
        })
    }
    function setupRenderEffect(instance, initialVnode, container) {
        //使响应式对象发生改变时,自动调用
        effect(() => {
            //init
            if (!instance.isMounted) {
                //取出组件vnode的setup代理对象
                const { proxy } = instance
                //将数据储存
                instance.subTree = instance.render.call(proxy)
                //将render的this指向proxy
                const subTree = instance.render.call(proxy)
                patch(null, subTree, container, instance)
                //将element的el赋值给组件vnode
                initialVnode.el = subTree.el
                instance.isMounted = true
            } else {
                //update
                const { proxy } = instance
                //更新前的数据
                const prevSubTree = instance.subTree
                //更新后的数据
                const subTree = instance.render.call(proxy)
                //将数据更新
                instance.subTree = subTree
                patch(prevSubTree, subTree, container, instance)
            }

        })
    }

    return {
        createApp: createAppAPI(render)
    }
}