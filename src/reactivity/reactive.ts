// @ts-ignore
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './basehandlers';
import { track, trigger } from "./effect";

export const enum ReactiveFlags {
    IS_REACTIVE = '_v_isReactive',
    IS_READONLY = '_v_isReadonly'
}

export function reactive(raw) {
    return createActiveObject(raw, mutableHandlers)
}
export function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers)
}

export function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers)
}

function createActiveObject(raw: any, baseHandlers) {
    return new Proxy(raw, baseHandlers)
}

export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value) {
    return isReactive(value) || isReadonly(value)
}