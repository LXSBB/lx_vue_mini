
const publicPropertiesMap = {
    $el: (i) => i.vnode.el
}
export const PublicInstanceProxyHandler = {
    get({_: instance}, key) {
        //处理setup函数中返回的对象
        const { setupState } = instance
        //返回查找的值
        if (key in setupState) {
            return setupState[key]
        }
        const publicGetter = publicPropertiesMap[key]
        if (publicGetter) {
            return  publicGetter(instance)
        }
    }
}