import {createVNode, Fragment} from "../vnode";

export function renderSlots(slots, name, props) {
    //如果是具名插槽
    const slot = slots[name]
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode(Fragment,{}, slot(props))
        }
    }
}