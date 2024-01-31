export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

export function isEmptyString(str){
    return str == null || str == undefined || String(str)?.trim() == '';
}

export function returnNullIfIsEmptyString(str){
    return isEmptyString(str) ? null : str;
}