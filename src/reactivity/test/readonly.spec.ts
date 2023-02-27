import { isProxy, isReadonly, readonly } from "../reactive";

describe('readonly', () => {
    it('should make nested values readonly', ()=> {
        const obj =  {foo:1, bar:{baz:2} };
        const wrapped = readonly(obj)
        expect(wrapped).not.toBe(obj)
        expect(isReadonly(wrapped)).toBe(true)
        expect(isProxy(wrapped)).toBe(true)
        expect(isReadonly(obj)).toBe(false)
        expect(isReadonly(wrapped.bar)).toBe(true)
        expect(isReadonly(obj.bar)).toBe(false)
        expect(wrapped.foo).toBe(1)
    })
    it('wran then call set', () => {
        console.warn = jest.fn()
        const readonlyObj = readonly({foo:1})
        
        readonlyObj.foo = 2
        expect(console.warn).toBeCalled()

    })
})