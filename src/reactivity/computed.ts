import { ReactiveEffect } from "./effect"

class ComputedRefImpl{
    private _getter
    private _value
    private _dirty = true
    private _effect
    constructor(getter){
        this._getter = getter
        //为保证多次get时 不重复调用getter，所以使用scheduler
        this._effect = new ReactiveEffect(getter, ( () => {
            if(!this._dirty) this._dirty = true;
        }))
    }
    get value(){
        //如果第一次调用，保存值
        //当依赖值触发时
        if (this._dirty){
            this._dirty = false
            this._value = this._effect.run()
        }
        return this._value
    }
}
export function computed(getter) {
    return new ComputedRefImpl(getter);
}