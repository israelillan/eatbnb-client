export const userFromBackendObject = (backendObject) => {
    return {backendObject: backendObject, ...backendObject.attributes};
}