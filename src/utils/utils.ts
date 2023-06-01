function groupBy<T>(arr: T[], fn: (item: T) => any) {
    return arr.reduce<Record<string, T[]>>((prev, curr) => {
        const groupKey = fn(curr);
        const group = prev[groupKey] || [];
        group.push(curr);
        return { ...prev, [groupKey]: group };
    }, {});
}

function objectEquals(a: any, b: any) {
    for (let prop in a) {
        if (a != null && Object.prototype.hasOwnProperty.call(a, prop)) {
            if (b != null && Object.prototype.hasOwnProperty.call(b, prop)) {
                if (typeof a[prop] === "object") {
                    if (!objectEquals(a[prop], b[prop])) return false;
                } else {
                    if (a[prop] !== b[prop]) return false;
                }
            } else {
                return false;
            }
        }
    }
    return true;
}

export { groupBy, objectEquals };
