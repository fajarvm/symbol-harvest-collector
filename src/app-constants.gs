// Symbol constants
const SYMBOL_MOSAIC_ID = "6BED913FA20223F8";
const HARVEST_FEE_TYPE = 8515; // Harvest Fee
const EPOCH_ADJUSTMENT = 1615853185; // Epoch adjustment from the /network/properties of the node used for fetching the data
const NOW_DATE = new Date();
const NOW_TS = NOW_DATE.getTime();
const REQUEST_PAGE_LIMIT = 20;

// Base32 constants
const RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV'
const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

// Application Errors
const ERROR_INVALID_ADDRESS = "Invalid Symbol address. Please enter a correct Symbol address.";
const ERROR_ADDRESS_PARSE = "Could not interpret the Symbol address. Please enter a correct address.";
const ERROR_INVALID_YEAR = "Invalid year. Please enter a year between 2021 and " + NOW_DATE.getFullYear()+".";
const ERROR_INVALID_NODE_URL = "Please enter a node URL.";
const ERROR_INVALID_DATA_VIEW = "Expected `data` to be an ArrayBuffer, Buffer, Int8Array, Uint8Array or Uint8ClampedArray";
