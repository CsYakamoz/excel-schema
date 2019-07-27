const R = require('ramda');
const assert = require('assert');
const Utils = require('../../utils');

const BaseSchema = require('../../schema/base');

/**
 * @param {object} sheetData
 * @param {BaseSchema} schema
 * @returns {any}
 */
module.exports = function convertData(sheetData, schema) {
    assert(
        schema._point !== undefined,
        'could not call executor without calling point method'
    );

    const point = Utils.parsePoint(schema._point);
    const rawValue = sheetData[point.row][point.col];

    return R.compose(
        wrapper(schema._after, rawValue, schema._point),
        wrapper(schema._parser, rawValue, schema._point),
        wrapper(schema._before, schema._point)
    )(rawValue);
};

/**
 * @param {Function} func
 * @param  {...any} args
 * @returns {Function}
 */
function wrapper(func, ...args) {
    if (func) {
        return R.partialRight(func, args);
    } else {
        return Utils.noOperation;
    }
}
