// @ts-ignore
import { hasChange, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

//ref 与 reactive区别于，ref可以传入非object的值，这样无法适用于proxy，所以使用class，
//class中设置value，对应其dep，从而对依赖的收集和触发
class RefImpl {
    //因为ref只有value一个属性，所以只有一个dep
    private _value: any;
    public dep
    private _rawValue //储存value值用于比对
    private __v_isRef = true
    constructor(value){
        this._rawValue = value
        //如果value是对象类型，则需要reactive包裹
        this._value = convert(value)
        this.dep = new Set()
    }
    get value() {
        //收集依赖
        trackRefValue(this)
        return this._value;
    }
    set value(newValue) {
        //如果值一样则不执行
        if(hasChange(newValue, this._rawValue)) {
            this._rawValue = newValue;
            //先赋值
            this._value = convert(newValue)
            triggerEffects(this.dep)
        }
    }
}

export function trackRefValue(ref) {
    //没收集过依赖的不要调用
    if (isTracking()) {
        trackEffects(ref.dep)
    }
}

export function convert(value) {
    return isObject(value) ? reactive(value) : value;
}

export function ref(value)  {
    return new RefImpl(value);
}

export function isRef(ref) {
    return !!ref.__v_isRef;
}

export function unRef(ref) {
    if (isRef(ref)) {
        return ref.value;
    } else {
        return ref;
    }
}

export function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key) {
            //如果是ref则返回.value
            return unRef(Reflect.get(target, key));
        },
        //如果set的对象是ref并且set的值不是ref数据，则替换ref.value
        //如果set的值是ref数据，则直接替换
        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                return target[key].value = value;
            } else {
                return Reflect.set(target, key, value);
            }
        }
    })
}