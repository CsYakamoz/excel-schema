const R = require('ramda');
const assert = require('assert');

module.exports = function convertData(sheetData, schema) {
    assert(
        schema._point !== undefined,
        'could not call executor without calling point method'
    );

    const rawValue = sheetData[schema._point].v;

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
    if (!R.isNil(func)) {
        return R.partialRight(func, args);
    } else {
        return R.identity;
    }
}
