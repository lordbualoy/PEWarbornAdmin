import { shallowRef, readonly, shallowReadonly } from 'vue'
import type { Component, InjectionKey } from 'vue'

export const mainSubViewSymbol = Symbol('mainSubViewSymbol') as InjectionKey<ReturnType<typeof useSubView>>

export function useSubView() {
    const activeSubView = shallowRef<Component>()
    const activeProps = shallowRef<any>()
    const stack: { component: Component; props: any }[] = []
    return {
        activeSubView: shallowReadonly(activeSubView),
        activeProps: shallowReadonly(activeProps),
        get stackDepth() {
            return stack.length
        },
        pushActiveSubView<T>(subView: Component, params?: T) {
            stack.push({ component: subView, props: params })
            activeProps.value = params
            activeSubView.value = subView
        },
        popActiveSubView() {
            stack.pop()
            const { component, props } = stack.length > 0 ? stack[stack.length - 1]! : {}
            activeSubView.value = component
            activeProps.value = props
        },
    }
}
