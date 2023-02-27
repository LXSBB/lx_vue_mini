import { isProxy, isReactive, reactive } from "../reactive";
describe('reactive', () => {
    it('happy path', () => {
        const obj = {foo : 1}
        const observed = reactive(obj)
        expect(observed).not.toBe(obj)
        expect(observed.foo).toBe(1)
    });
    test('nested reactive', () => {
        const obj = {
            nested: {
                foo:1
            },
            array: [{bar: 2}]
        }
        const observed = reactive(obj)
        expect(isReactive(observed)).toBe(true)
        expect(isProxy(observed)).toBe(true)
        expect(isReactive(observed.nested)).toBe(true)
        expect(isReactive(observed.array)).toBe(true)
        expect(isReactive(observed.array[0])).toBe(true)
    })
})