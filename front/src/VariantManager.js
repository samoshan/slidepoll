import * as variantsImport from './variant-definitions';

const map = new Map();

function addVariant(def) {
    map.set(def.id, def);
}
for (const x of Object.keys(variantsImport)) {
    addVariant(variantsImport[x]);
}

function getAll() {
    return Array.from(map.values());
}

function get(name) {
    return map.get(name);
}

export default {
    ...Object.fromEntries(map),
    getAll,
    get
}
