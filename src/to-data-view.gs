/**
 * Source: https://github.com/LinusU/to-data-view
 */

function toDataView(data) {
    if (data instanceof Int8Array || data instanceof Uint8Array || data instanceof Uint8ClampedArray) {
        return new DataView(data.buffer, data.byteOffset, data.byteLength)
    }

    if (data instanceof ArrayBuffer) {
        return new DataView(data)
    }

    throw new TypeError(ERROR_INVALID_DATA_VIEW)
}
