const R = require('ramda');
const assert = require('assert');
const Utils = require('../../utils');

const BaseSchema = require('../../schema/base');
const ArraySchema = require('../../schema/array');

const parseCellData = require('../parse_cell_data');

module.exports = analyzeNode;

/**
 * @param {object} sheetData
 * @param {any} schema
 */
function analyzeNode(sheetData, schema, operation = parseCellData) {
    if (schema instanceof ArraySchema) {
        if (operation !== parseCellData) {
            return analyzeArray(sheetData, operation(sheetData, schema));
        }

        return analyzeArray(sheetData, schema);
    }

    if (schema instanceof BaseSchema) {
        return operation(sheetData, schema);
    }

    // do not handle such data
    if (schema === undefined || schema === null) {
        return schema;
    }

    return builtInType(sheetData, schema, operation);
}

/**
 * @param {object} sheetData
 * @param {any} schema
 */
function builtInType(sheetData, schema, operation) {
    function arrayNode(sheetData, arr, operation) {
        return arr.map(schema => analyzeNode(sheetData, schema, operation));
    }

    function objectNode(sheetData, obj, operation) {
        const cp = {};

        for (const prop in obj) {
            cp[prop] = analyzeNode(sheetData, obj[prop], operation);
        }

        return cp;
    }

    function objectType(sheetData, schema, operation) {
        if (schema.constructor === Array) {
            return arrayNode(sheetData, schema, operation);
        }

        if (schema.constructor === Object) {
            return objectNode(sheetData, schema, operation);
        }

        throw new Error(`unsupported obj(${schema})`);
    }

    const type = typeof schema;
    const dict = {
        boolean: R.identity,
        number: R.identity,
        string: R.identity,
        symbol: R.identity,
    };

    if (dict[type] !== undefined) {
        return dict[type](schema);
    } else {
        return objectType(sheetData, schema, operation);
    }
}

/**
 * @param {object} sheetData
 * @param {ArraySchema} schema
 */
function analyzeArray(sheetData, schema) {
    function updatePointOrRange(additionRow, additionCol, sheetData, schema) {
        if (schema instanceof BaseSchema) {
            return Utils.cloneObj(schema).point(
                Utils.changePoint(additionRow, additionCol, schema._point)
            );
        }

        if (schema instanceof ArraySchema) {
            assert(
                schema._range !== null,
                'should not call executor before calling range method'
            );
            assert(
                schema._item !== null,
                'should not call executor before calling item method'
            );

            return Utils.cloneObj(schema)
                .range(
                    Utils.changePoint(
                        additionRow,
                        additionCol,
                        schema._range.first
                    ),
                    Utils.changePoint(
                        additionRow,
                        additionCol,
                        schema._range.last
                    )
                )
                .item(
                    analyzeNode(
                        sheetData,
                        schema._item,
                        R.partial(updatePointOrRange, [
                            additionRow,
                            additionCol,
                        ])
                    )
                );
        }

        throw new Error(`unsupported schema(${schema})`);
    }

    const [intervalRow, intervalCol] = [
        schema._interval.row,
        schema._interval.col,
    ];
    const length = Utils.calcLengthBtwTwoPoint(
        schema._range.first,
        schema._range.last,
        intervalRow,
        intervalCol
    );

    const schemaArr = [];
    for (let i = 0; i < length.row; i++) {
        for (let j = 0; j < length.col; j++) {
            const updatedSchema = analyzeNode(
                sheetData,
                schema._item,
                R.partial(updatePointOrRange, [
                    i * intervalRow,
                    j * intervalCol,
                ])
            );

            schemaArr.push(updatedSchema);
        }
    }

    const data = analyzeNode(sheetData, schemaArr);

    return schema._after !== null ? schema._after(data) : data;
}
