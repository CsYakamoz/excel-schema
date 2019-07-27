const assert = require('assert');
const BaseSchema = require('../base');

/**
 * @param {number} input
 */
function parseExcelDate(input) {
    assert(typeof input === 'number', 'no a excel date cell');

    /**
     * keyword: excel leap year bug
     * reference: https://gist.github.com/christopherscott/2782634
     */
    return new Date((input - (25567 + 2)) * 86400 * 1000);
}

class DateSchema extends BaseSchema {
    constructor() {
        super(parseExcelDate);
    }
}

module.exports = DateSchema;
