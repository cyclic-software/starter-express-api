const isEmptyObject = (obj: object): boolean => {
    return !Object.keys(obj).length;
};

export { isEmptyObject }