/**
 * input: 682AE8CC97DA1E1052D00851B46C2343A5C054EFCAC4517F
 * output: NAVORTEX3IPBAUWQBBI3I3BDIOS4AVHPZLCFC7Y
 */
function toAddress(hexString) {
    return base32Encode(fromHexString(hexString), 'RFC4648').replace("=", "");
}

/**
 * input: NAVORTEX3IPBAUWQBBI3I3BDIOS4AVHPZLCFC7Y
 * output: 682AE8CC97DA1E1052D00851B46C2343A5C054EFCAC4517F
 */
function fromAddress(addressString) {
    let address = addressString.replace("-", "") + "=";
    let bytes = new Uint8Array(base32Decode(address, 'RFC4648'));
    return toHexString(bytes).toUpperCase();
}

function fromHexString(hexString) {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

function toHexString(bytes) {
    return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

function getDate(timestamp) {
    let ts = getTs(timestamp);
    return new Date(ts * 1000);
}

function printDate(date) {
    return Utilities.formatDate(date, "GMT", "yyyy-MM-dd");
}

/**
 * corrected timestamp = EPOCH_ADJUSTMENT + (receiptTs / 1000)
 */
function getTs(receiptTs) {
    let ts = parseInt(receiptTs);
    return (ts * 1000) > NOW_TS ? parseInt(EPOCH_ADJUSTMENT + (ts / 1000)) : ts;
}

function getAmount(receiptAmount) {
    return Number(receiptAmount / 1000000);
}
