import {getCurrentInstance} from "./component";

export function provide(key, value) {
    //获取组件实例
    const currentInstance: any = getCurrentInstance()
    if (currentInstance) {
        let {provides} : any = currentInstance
        const parentProvides = currentInstance.parent.provides
        //当provides和父级一致时,说明provides并没有初始化过
        if (provides === parentProvides) {
            //初始化provides,provides应该是继承父级provides
            provides = currentInstance.provides =  Object.create(parentProvides)
        }
        provides[key] = value
    }
}

export function inject(key, defaultValue) {
    const currentInstance: any = getCurrentInstance()
    if (currentInstance) {
        //从组件实例上的父级上获取provides
        const parentProvides = currentInstance.parent.provides
        if (key in parentProvides) {
            return parentProvides[key]
        } else if (defaultValue) {
            //默认值是函数则调用
            if (typeof defaultValue === 'function') return defaultValue()
            //返回默认值
            return defaultValue
        }
    }
}