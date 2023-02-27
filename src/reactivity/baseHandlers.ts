import { extend, isObject } from "../shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true)
const readonlySet = createSetter(true)
const shallowReadonlyGet = createGetter(true, true)
const shallowReadonlySet = createSetter(true)

function createGetter(isReadOnly = false, shallow = false ) {
    return function get(target, key) {
        //进行isReactive或者isReadonly判断时
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadOnly
        } else if(key === ReactiveFlags.IS_READONLY) {
            return isReadOnly
        }
        const res = Reflect.get(target,key);
        //shallowReadonly无需对子项进行响应式处理
        if (shallow) {
            return res
        }
        //层叠对象需要继续响应式处理
        if(isObject(res)) {
            return isReadOnly ? readonly(res) : reactive(res)
        }
        if(!isReadOnly) {
            //收集依赖
            track(target, key)
        }
        return res
    }
}
function createSetter(isReadOnly: boolean = false) {
    return function set(target,key,value) {
        if (isReadOnly) {
            console.warn('失败')
            return true
        }
        const res = Reflect.set(target,key,value);
        //触发依赖
        trigger(target, key)
        return res
    }
}

export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGet,
    set: readonlySet
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers,{
    get: shallowReadonlyGet,
    set: shallowReadonlySet
})