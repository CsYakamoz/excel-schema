const assert = require('assert');
const Utils = require('../../utils');

/**
 * @param {string} first
 * @param {string} last
 */
function checkRange(first, last) {
    const fPoint = Utils.parsePoint(first);
    const lPoint = Utils.parsePoint(last);

    assert(
        lPoint.row >= fPoint.row &&
            Utils.excelTitleToNumber(lPoint.col) >=
                Utils.excelTitleToNumber(fPoint.col),
        `last point(${last}) should be large than first point(${first})`
    );
}

class ArraySchema {
    constructor() {
        this._range = null;
        this._item = null;
        this._after = null;
        this._interval = { row: 1, col: 1 };
    }

    /**
     * @param {string} first
     * @param {string} last
     */
    range(first, last) {
        assert(Utils.pointPattern.test(first), `invalid point(${first})`);
        assert(Utils.pointPattern.test(last), `invalid point(${last})`);

        first = first.toUpperCase();
        last = last.toUpperCase();

        checkRange(first, last);


        this._range = { first, last };

        return this;
    }

    /**
     * @param {number} row
     * @param {number} col
     */
    interval(row, col) {
        this._interval.row = row;
        this._interval.col = col;

        return this;
    }

    /**
     * @param {any} schema 
     */
    item(schema) {
        assert(schema !== undefined, 'schema should not be undefined');

        this._item = schema;

        return this;
    }

    /**
     * @param {Function} func
     */
    after(func) {
        assert(typeof func === 'function', 'after should be function');

        this._after = func;

        return this;
    }
}

module.exports = ArraySchema;
