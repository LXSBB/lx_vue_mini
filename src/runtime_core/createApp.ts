import {createVNode} from "./vnode";

export function createAppAPI(render) {
    return  function createApp(rootComponent) {
        return {
            mount(rootContainer){
                //先转换成vNode component -> vNode
                const vnode = createVNode(rootComponent)
                console.log(vnode,'createApp')
                render(vnode, rootContainer)
            }
        }
    }
}

