const BaseSchema = require('../base');

class StringSchema extends BaseSchema {
    constructor() {
        super(x => String(x));
    }
}

module.exports = StringSchema;
