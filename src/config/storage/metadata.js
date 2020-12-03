import { newStore } from "./store";
// import { ApiPromise } from "@polkadot/api";

const storeName = "substrate";
const keyMetadata = "metadata";
const store = newStore(storeName);


export async function cacheSubstrateMetadata(api) {
    if (!api) return;
    if (!api.isReady) return;

    const genesisHash = api.genesisHash;
    const { specVersion } = api.runtimeVersion;
    const key = `${genesisHash}-${specVersion}`;
    const value = api.runtimeMetadata.toHex();

    await setSubstrateMetadata({ key, value });
    // log.info(`Substrate metadata cached locally. Metadata key: ${key}`)
}

/**
 * Metadata `key` consists of `${genesisHash}-${runtimeVersion.specVersion}`.
 * Metadata `value` is a hex representation of metadata.
 */
async function setSubstrateMetadata(metadata) {
    await store.setItem(keyMetadata, metadata);
}

export async function getSubstrateMetadataRecord() {
    const cachedMetadata = await getSubstrateMetadata();

    if (!cachedMetadata) return undefined;

    return { [cachedMetadata.key]: cachedMetadata.value };
}

export async function getSubstrateMetadata() {
    try {
        const metadata = await store.getItem(keyMetadata);

        if (!metadata) throw new Error("Metadata is empty");
        // if (isEmptyStr(metadata.key)) throw new Error("Metadata key is empty");
        // if (isEmptyStr(metadata.value)) throw new Error("Metadata value is empty");

        // log.info(`Substrate metadata found in the local cache. Metadata key: ${metadata.key}`)
        return metadata;
    } catch (err) {
        // log.warn(`Failed to get Substrate metadata. ${err}`)
        return undefined;
    }
}