// @ts-ignore
import {camelize, capitalize} from "../shared";

export function emit(instance, event, ...args) {
    const {props} = instance
    //获取props中匹配的自定义方法
    const handler = props[`on${capitalize(camelize(event))}`]
    handler && handler(...args)
}