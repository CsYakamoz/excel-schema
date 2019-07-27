const ArraySchema = require('./array');
const BooleanSchema = require('./boolean');
const CustomSchema = require('./custom');
const DateSchema = require('./date');
const NumberSchema = require('./number');
const StringSchema = require('./string');

module.exports = {
    array: () => new ArraySchema(),
    boolean: () => new BooleanSchema(),
    /**
     * @param {Function} parser
     */
    custom: parser => () => new CustomSchema(parser),
    date: () => new DateSchema(),
    number: () => new NumberSchema(),
    string: () => new StringSchema(),
};
