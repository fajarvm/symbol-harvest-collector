function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Collect Harvested Fees')
        .addItem('Collect and display harvested fees', 'collectHarvestedFees')
        .addToUi();
}

function collectHarvestedFees() {
    var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadSheet.getActiveSheet();
    var targetAddress = sheet.getRange(1, 2).getValue();
    if (targetAddress.length <= 0) {
        throw new Error(ERROR_INVALID_ADDRESS);
    }
    var targetAddressHex;
    try {
        targetAddressHex = fromAddress(targetAddress);
    } catch (error) {
        throw new Error(ERROR_ADDRESS_PARSE);
    }
    var targetYear = parseInt(sheet.getRange(2, 2).getValue());
    if (targetYear < 2021 || targetYear > NOW_DATE.getFullYear()) {
        throw new Error(ERROR_INVALID_YEAR);
    }
    var restNodeUrl = sheet.getRange(3, 2).getValue();
    if (restNodeUrl.length <= 0) {
        throw new Error(ERROR_INVALID_NODE_URL);
    }

    var startingRow = 5;
    var startingPageNumber = 1;
    let requestData = {
        url: restNodeUrl,
        address: targetAddress,
        address_hex: targetAddressHex,
        page: startingPageNumber,
        row: startingRow,
        year: targetYear,
        finished: false,
        fees_by_month: [{ fees: 0 }]
    }

    // Step 1. Collect harvested fees for the target year
    do {
        // Logger.log("page=" + requestData.page);
        collectData(requestData);
        requestData.page = requestData.page + 1;
    } while (!requestData.finished && requestData.page <= REQUEST_PAGE_LIMIT);

    // Step 2. Display harvested fees in the Spreadsheet
    displayInSheetFromRow(sheet, startingRow, requestData);
}

function collectData(requestData) {
    var response = UrlFetchApp.fetch("https://" + requestData.url + ":3001/statements/transaction?"
        + "targetAddress=" + requestData.address
        + "&receiptType=" + HARVEST_FEE_TYPE
        + "&pageNumber=" + requestData.page);
    var json = response.getContentText();
    var data = JSON.parse(json);

    if (data["data"].length == 0) {
        requestData.finished = true;
    } else {
        requestData.finished = false;
    }

    var firstEntryDate = getDate(data["data"][0]?.meta.timestamp);
    if (firstEntryDate !== undefined && firstEntryDate.getFullYear() > requestData.year) {
        requestData.finished = true;
    }

    data["data"]
        .filter(entry => getDate(entry.meta.timestamp).getFullYear() == requestData.year)
        .forEach(entry => {
            let metaDate = getDate(entry.meta.timestamp);
            requestData.finished = false;
            entry["statement"]["receipts"]
                .filter(r => r.type == HARVEST_FEE_TYPE && r.mosaicId == SYMBOL_MOSAIC_ID && r.targetAddress == requestData.address_hex)
                .forEach(r => {
                    const amount = getAmount(r.amount);
                    if (requestData.fees_by_month[metaDate.getMonth()] == undefined) {
                        requestData.fees_by_month[metaDate.getMonth()] = {
                            fees: amount
                        };
                    } else {
                        requestData.fees_by_month[metaDate.getMonth()].fees += amount;
                    }
                });
        });
}

function displayInSheetFromRow(sheet, row, data) {
    let sheetRow = row;
    for (var i = 0; i < 12; i++) {
        sheet.getRange(sheetRow, 1).setValue(i + 1);
        if (data.fees_by_month[i] === undefined) {
            sheet.getRange(sheetRow, 2).setValue(0);
        } else {
            sheet.getRange(sheetRow, 2).setValue(data.fees_by_month[i].fees);
        }
        sheetRow += 1;
    }
}
