import v8 from 'v8';
export function cloneDeep(obj) {
    return v8.deserialize(v8.serialize(obj));
}
//# sourceMappingURL=cloneDeep.js.map