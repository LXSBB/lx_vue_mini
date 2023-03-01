//对象继承合并
export const extend = Object.assign
//是否是对象类型
export const isObject = (val) => {
    return val!== null && typeof val === 'object'
}
//值是否改变
export const hasChange = (a, b) => {
    return !Object.is(a,b)
}
//对象是否由此属性
export function hasOwn(val, key) {
    return Object.prototype.hasOwnProperty.call(val, key)
}
//字符串首字母大写
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
//_a +> A
export function camelize(str) {
    return str.replace(/-(\w)/g, (_, c) => {
        return c?c.toUpperCase():''
    })
}