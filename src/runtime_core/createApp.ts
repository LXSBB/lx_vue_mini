import {createVNode} from "./vnode";
import {render} from "./renderer";

export function createApp(rootComponent) {
    return {
        mount(rootContainer){
            //先转换成vNode component -> vNode
            const vnode = createVNode(rootComponent)
            console.log(vnode,'createApp')
            render(vnode, rootContainer)
        }
    }
}

