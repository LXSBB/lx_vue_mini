import { reactive } from "../reactive"
import { effect, stop } from "../effect"
/**
 * 1.reactive中使用new proxy将对象包装，给予get和set方法
 * 2.执行effect函数，将传入的fn封装进ReactiveEffect类中，并调用，最终存储进activeEffects全局变量中
 * 3.调用方法会触发proxy中的get方法，从而执行track方法进行依赖收集
 * 4.track方法中以层层递进的方式收集每一个target中每一个key的依赖，最终每个key值都会对应一个dep（key所有依赖的集合）
 * 5.当对reactive中数值进行修改时，会触发其set操作
 * 6.从而触发set中触发依赖的函数
 * 7.通过target，key可以找到key对应的依赖集合dep，并循环触发
 */

describe('effect', () => {
    //测试reactive和effect 的依赖收集 触发依赖的功能
     it('happy path', () => {
        const user = reactive({
            age: 10
        })

        let nextAge

        effect(() => {
            nextAge = user.age + 1
        })

        expect(nextAge).toBe(11)
        user.age++
        expect(nextAge).toBe(12)

    })

    //测试effect 的返回值是否是传入的函数
    it('should return runner when call effect', () => {
        let i = 10;
        const runner = effect(() => {
            i++
            return 'i'
        })
        expect(i).toBe(11)
        const result = runner()
        expect(i).toBe(12)
        expect(result).toBe('i')
    })
    
    //测试effect第二个参数scheduler参数的作用
    it('scheduler', () => {
        let dummy
        let run
        const scheduler = jest.fn(() => {
            run = runner
        })
        const obj = reactive({
            foo: 1
        })
        const runner = effect(() => {
            dummy = obj.foo
        }, { scheduler })

        //effect第一次调用时，scheduler不调用
        expect(scheduler).not.toHaveBeenCalled()
        //调用回调函数
        expect(dummy).toBe(1)
        obj.foo++
        //当依赖产生变化时，也就是触发依赖执行trigger函数不直接调用回调函数，而是判断有无scheduler配置从而调用一次
        expect(scheduler).toHaveBeenCalledTimes(1)
        expect(dummy).toBe(1)
        //当执行runner的时候 会再执行effect的回调函数
        run()
        expect(dummy).toBe(2)
    })

    it('stop', () => {
        let dummy
        const obj = reactive({
            foo: 1
        })
        const runner = effect(() => {
            dummy = obj.foo
            
        })
        //当调用stop功能时，set产生的依赖回调将不再触发
        //本质上就是，清除当前依赖上deps中runner所属的effect实例
        //这样就无法在循环deps中调用到当前的effect
        //要注意的是，有些情况下在stop调用后，又进行了set操作，导致了重新收集了一边依赖
        //所以在执行run的时候得判断当前依赖的状态是否是stop状态
        obj.foo = 2
        expect(dummy).toBe(2)
        stop(runner)
        obj.foo++
        expect(dummy).toBe(2)
        runner()
        expect(dummy).toBe(3)
    })

    //当stop执行时执行
    it('onStop', () => {
        let dummy,a
        const obj = reactive({
            foo: 1
        })
        const onStop = jest.fn(() => {
            a = dummy
        })
        const runner = effect(() => {
            dummy = obj.foo
        }, { onStop })
        stop(runner)
        expect(onStop).toBeCalledTimes(1)
    })
})

