import { effect } from "../effect"
import { reactive } from "../reactive"
import { isRef, proxyRefs, ref, unRef } from "../ref"

describe('ref', () => {
    it('hanppy path', () => {
        const a = ref(1)
        expect(a.value).toBe(1)
    })
    it('should be reactive', () => {
        const a = ref(1)
        let dummy
        let calls = 0
        effect(() => {
            calls++
            dummy = a.value
        })
        expect(calls).toBe(1)
        expect(dummy).toBe(1)
        a.value = 2
        expect(calls).toBe(2)
        expect(dummy).toBe(2)
        //重复set 不会重复触发trigger
        a.value = 2
        expect(calls).toBe(2)
        expect(dummy).toBe(2)
    })
    //当value为{}
    it('should make nested properties reactive', () => {
        const a = ref({
            foo: 1
        })
        let dummy
        effect(() => {
            dummy = a.value.foo
        })
        expect(dummy).toBe(1)
        a.value.foo = 2
        expect(dummy).toBe(2)
    })
    it('isRef', () => {
        const a = ref(1)
        const b = reactive({
            foo: 1
        })
        expect(isRef(a)).toBe(true)
        expect(isRef(1)).toBe(false)
        expect(isRef(b)).toBe(false)
    })
    it('unRef', () => {
        const a = ref(1)
        expect(unRef(1)).toBe(1)
        expect(unRef(a)).toBe(1)
    })
    //在vue3 中template对ref的值无需.value调用，是调用了proxyRefs
    it('proxyRefs', () => {
        const a = {
            b: ref(1),
            c: 2
        }
        const proxyA = proxyRefs(a)
        //get
        expect(a.b.value).toBe(1)
        expect(proxyA.b).toBe(1)
        expect(proxyA.c).toBe(2)
        //set
        proxyA.b = 10
        expect(a.b.value).toBe(10)
        expect(proxyA.b).toBe(10)
        proxyA.b = ref(20)
        expect(proxyA.b).toBe(20)
        expect(a.b.value).toBe(20)
    })
})