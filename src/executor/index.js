const fs = require('fs');
const assert = require('assert');
const XLSX = require('xlsx');

const analyzeNode = require('./analyze_node');

/**
 * @typedef {object} ExecutorOption
 * @property {number|string} sheet  sheet's name or sheet's idx(base 0)
 */

/**
 * @param {string} filename
 * @param {any} schema
 * @param {ExecutorOption} [userOption]
 * @returns {any}
 */
module.exports = function Executor(filename, schema, userOption) {
    assert(schema !== undefined, 'schema should not be undefined');
    assert(fs.existsSync(filename), `file(${filename}) is not exist`);

    const option = { ...defaultOption(), ...userOption };
    const workbook = XLSX.readFile(filename);
    const sheetName = getSheetName(option.sheet, workbook.SheetNames);
    const sheet = workbook.Sheets[sheetName];

    return analyzeNode(sheet, schema);
};

/**
 * @returns {ExecutorOption}
 */
function defaultOption() {
    return { sheet: 0 };
}

/**
 * @param {number | string} sheet
 * @param {string[]} SheetNames
 * @returns {string}
 */
function getSheetName(sheet, SheetNames) {
    if (typeof sheet === 'string') {
        assert(SheetNames.includes(sheet), `no such sheet with name(${sheet})`);

        return sheet;
    } else {
        assert(sheet < SheetNames.length, `no such sheet with idx(${sheet})`);

        return SheetNames[sheet];
    }
}
