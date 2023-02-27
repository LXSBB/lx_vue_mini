import { extend } from "../shared";
const targetMap = new Map();

let activeEffects;
let shouldTrack = false

//收集依赖
export function track(target, key) {
    //targetMap(key: reactive对象 => value: depsMap)
    //desMap(key: reactive对象中每一个属性 => value: dep)
    //dep [一个个依赖实例]
    
    
    if (!activeEffects) return
    //判断是否需要进行track操作，保证stop状态下不收集依赖，从而触发导致数据更新
    if(!shouldTrack) return
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    //每一个key值对映的依赖
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep);
    }
    //如果effect已经在dep中则不需要放置
    if (dep.has(activeEffects)) return;
    trackEffects(dep)
}
export function trackEffects(dep) {
    //将依赖实例放置dep中
    dep.add(activeEffects)
    //反向存储，用于依赖实例可以找到其对应的dep
    activeEffects.deps.push(dep);
}

//数据是否收集过依赖或者应该收集
export function isTracking(){
    return shouldTrack && activeEffects !== undefined;
}

//触发依赖
export function trigger(target, key) {
    const desMap = targetMap.get(target);
    const dep = desMap.get(key);
    triggerEffects(dep)
}
export function triggerEffects(dep) {
    for(const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }
    }
}

//依赖类
export class ReactiveEffect{
    private _fn: Function;
    isActive = true
    onStop?: () => void;
    //当前依赖实例，绑定的所有的依赖源
    deps: any = []

    constructor(fn, public scheduler?){
        this._fn = fn;
    }
    run(){
        //如果是stop的状态，则shouldTrack为false，这样下面每一次因为get或者触发依赖而调用的track都无法执行（无法收集依赖）
        if (!this.isActive) {
            return this._fn();
        }
        //调用fn会进行收集依赖的操作，所以先赋值允许收集
        activeEffects = this
        shouldTrack = true
        const result = this._fn();
        shouldTrack = false
        return result;
    }
    stop() {
        if (this.isActive) {
            this.onStop && this.onStop()
            cleanupEffect(this)
            this.isActive = false;
        }
    }
}

//将自己从依赖源中删除
function cleanupEffect(effect) {
    effect.deps.forEach(dep => dep.delete(effect));
}

export function effect(fn, options?) {
    const scheduler = options && options.scheduler;
    const _effect = new ReactiveEffect(fn, scheduler);
    extend(_effect, options);
    //触发effect是执行一次回调
    _effect.run();
    //因为要返回出去调用，所以修改run函数的this指向当前的新建的实例
    const runner: any = _effect.run.bind(_effect);
    //将当前新建的实例保存在返回值的effect属性中，便于通过runner调用实例的其他方法
    runner.effect = _effect;
    return runner;  
}

export function stop(runner) {
    runner.effect.stop();
}