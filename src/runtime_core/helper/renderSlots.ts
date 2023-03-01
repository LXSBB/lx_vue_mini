import {createVNode} from "../vnode";

export function renderSlots(slots, name, props) {
    //如果是具名插槽
    const slot = slots[name]
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode('div',{}, slot(props))
        }
        //插槽使用div包裹
        return createVNode('div',{}, slot)
    }
}