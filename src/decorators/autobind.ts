export function autobind(target: any, methodName: string, descriptor: PropertyDescriptor) {
    console.log("The target :", target)
    console.log("The method name :", methodName)
    console.log("The descriptor object :", descriptor)

    const originalMethod = descriptor.value
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }

    return adjustedDescriptor
}