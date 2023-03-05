import {createComponentInstance, setupComponent} from "./component";
import {ShapeFlags} from "../shared/ShapeFlags";
import {Fragment, Text} from "./vnode";
import {createAppAPI} from "./createApp";
import {effect} from "../reactivity/effect";
import {EMPTY_OBJ} from "../shared";

export function createRenderer(options) {
    const { createElement,
        patchProp: hostPatchProp,
        insert,
        remove: hostRemove,
        setElementText: hostSetElementText
    } = options

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
            patchElement(n1, n2, container, parentComponent)
        }
    }

    function processFragment(n1, n2, container: any, parentComponent) {
        mountChildren(n2.children, container, parentComponent)
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
        const el = (vnode.el = createElement(vnode.type))
        const { children, props, shapeFlag } = vnode
        //判断子节点类型
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = children
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN){
            //如果是数组继续用patch转换
            mountChildren(vnode.children, el, parentComponent)
        }
        for(const key in props) {
            const val = props[key]
            //统一处理属性
            hostPatchProp(el, key, null, val)
        }
        //统一append
        insert(el, container)
    }

    //更新element
    function patchElement(n1, n2, container, parentComponent) {
        console.log(n1, n2)
        const oldProps = n1.props || EMPTY_OBJ
        const newProps = n2.props || EMPTY_OBJ
        //只有在mount时会创建el,所以得把el传承给新数据
        const el = (n2.el = n1.el)
        patchProps(el, oldProps, newProps)
        patchChildren(n1, n2, el, parentComponent)
    }

    //对比props 进行更新
    function patchProps(el, oldProps, newProps) {
        if (oldProps !== newProps) {
            for (const key in newProps) {
                const prevProp = oldProps[key]
                const nextProp = newProps[key]
                //数值不同 更新
                if (prevProp !== nextProp) {
                    hostPatchProp(el, key, prevProp, nextProp)
                }
            }
            if (oldProps !== EMPTY_OBJ) {
                //当新的对象中没有旧对象的值,则需删除
                for (const key in oldProps) {
                    if (!(key in newProps)) {
                        hostPatchProp(el, key, oldProps[key], null)
                    }
                }
            }
        }
    }

  /**
   * 更新对比子节点
   * @param n1 旧节点
   * @param n2 新节点
   * @param container 父节点el
   * @param parentComponent 父节点数据
   * */
    function patchChildren(n1, n2, container, parentComponent) {
        const prevShapeFlag = n1.shapeFlag
        const {shapeFlag} = n2
        const c2 = n2.children
        const c1 = n1.children
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            //new : text
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                //array => text
                //先把旧数据中的children清空,再设置text
                unmountChildren(n1.children)
            }
            if (c1 !== c2) {
                hostSetElementText(container, c2)
            }
        } else {
            //new : array
            if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                // text => array
                hostSetElementText(container, '')
                mountChildren(c2, container, parentComponent)
            } else {
                // array => array
                patchKeyedChildren(c1, c2, container, parentComponent)
            }
        }
    }

    /**
     * 双端对比子节点
     * @param c1 旧节点
     * @param c2 新节点
     * @param container
     * @param parentComponent
     * */
    function patchKeyedChildren(c1, c2, container, parentComponent) {
        // e1 : 旧数组的右侧指针
        let e1 = c1.length - 1
        // i : 新数组的左侧指针
        let i = 0
        // e2 : 新数组的右侧指针
        let e2 = c2.length - 1

        //左侧对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[i]
            const n2 = c2[i]
            if (isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent)
            } else {
                //节点不一致时
               break
            }
            i++
        }
        console.log(i, '================>')
        //右侧对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1]
            const n2 = c2[e2]
            if (isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent)
            } else {
                //节点不一致时
                break
            }
            e1--
            e2--
        }
        console.log(e1, e2)
    }

    function isSomeVNodeType(n1, n2) {
        return n1.type === n2.type && n1.key === n2.key
    }

    //删除子节点
    function unmountChildren(children) {
        for (let i = 0; i < children.length; i++) {
            hostRemove(children[i].el)
        }
    }

    function mountChildren(children, container, parentComponent) {
        children.forEach(v => {
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
                //将render的this指向proxy
                const subTree = (instance.subTree =  instance.render.call(proxy))
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