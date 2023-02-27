import { computed } from "../computed"
import { reactive } from "../reactive"

describe('computed', () => {
    it('happy path', () => {
        const obj = reactive({
            foo:1
        })
        const a = computed(() => {
            return obj.foo
        })
        expect(a.value).toBe(1)
    })
    it('should computed lazily', () => {
        const value = reactive({
            foo:1
        })
        const getter = jest.fn(() => {
            console.log('11111')
            return value.foo
        })
        const cValue = computed(getter)
        //当不查cValue.value,getter不会被调用
        expect(getter).not.toHaveBeenCalled()
        expect(cValue.value).toBe(1)
        expect(getter).toHaveBeenCalledTimes(1)
        
        //多次get时getter只会调一遍
        cValue.value
        expect(getter).toHaveBeenCalledTimes(1)
        
        //当绑定的依赖值发生改变时，getter无需调用
        value.foo = 2
        expect(getter).toHaveBeenCalledTimes(1)

        //当依赖值改变时，进行get，getter可以调用一遍
        expect(cValue.value).toBe(2)
        expect(getter).toHaveBeenCalledTimes(2)
        
        //继续get 则无法调用getter
        cValue.value
        expect(getter).toHaveBeenCalledTimes(2)

    })
})