import { isReadonly, shallowReadonly } from "../reactive"

describe('shallowReadonly', () => {
    //只有外层时readonly响应式对象，内层是原始对象
    test('should not make non-reactive properties reactive', () => {
        const obj = shallowReadonly({n: {foo: 1}})
        expect(isReadonly(obj)).toBe(true)
        expect(isReadonly(obj.n)).toBe(false)
    })
    it('wran then call set', () => {
        console.warn = jest.fn()
        const readonlyObj = shallowReadonly({foo:1})
        
        readonlyObj.foo = 2
        expect(console.warn).toBeCalled()

    })
})