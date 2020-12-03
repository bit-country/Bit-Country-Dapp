import localForage from "localforage";

export const newStore = storeName =>
    localForage.createInstance({
        name: "BitCountryMetadata",
        storeName
    });
