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