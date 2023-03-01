import {ShapeFlags} from "../shared/ShapeFlags";

export function initSlot(instance, children) {
    const {vnode} = instance
    //拥有插槽时
    if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
        //当组件拥有插槽时,虚拟节点的children是对象类型
        const slots = {}
        for(const key in children) {
            const value = children[key]
            //返回的slot应该包裹一层[]
            slots[key] = (props) => normalizeSlotValue(value(props))
        }
        instance.slots = slots
    }
}

//包裹一层[]
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value]
}