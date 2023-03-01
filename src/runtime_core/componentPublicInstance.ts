// @ts-ignore
import {hasOwn} from "../shared";

const publicPropertiesMap = {
    $el: (i) => i.vnode.el
}

//在render函数上返回
export const PublicInstanceProxyHandler = {
    get({_: instance}, key) {
        //处理setup函数中返回的对象
        const { setupState, props } = instance
        //返回查找的值
        if (hasOwn(setupState, key)) {
            return setupState[key]
        } else if(hasOwn(props, key)) {
            return props[key]
        }
        //动态调用方法返回属性
        const publicGetter = publicPropertiesMap[key]
        if (publicGetter) {
            return  publicGetter(instance)
        }
    }
}