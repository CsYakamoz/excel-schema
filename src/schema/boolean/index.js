const BaseSchema = require('../base');

class BooleanSchema extends BaseSchema {
    constructor() {
        super(x => !!x);
    }
}

module.exports = BooleanSchema;
