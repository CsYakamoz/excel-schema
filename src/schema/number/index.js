const BaseSchema = require('../base');

class NumberSchema extends BaseSchema {
    constructor() {
        super(x => parseFloat(parseFloat(x).toPrecision(12)));
    }
}

module.exports = NumberSchema;
