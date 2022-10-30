export function autobind(target, methodName, descriptor) {
    console.log("The target :", target);
    console.log("The method name :", methodName);
    console.log("The descriptor object :", descriptor);
    const originalMethod = descriptor.value;
    const adjustedDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjustedDescriptor;
}
//# sourceMappingURL=autobind.js.map