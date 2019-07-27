const R = require('ramda');
const assert = require('assert');

const LetterList = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

module.exports = {
    pointPattern: /^[a-zA-Z]+(?:[1-9]{1}\d*)$/,

    /**
     * reference: http://es6.ruanyifeng.com/#docs/object
     * @param {object} original
     * @return {object}
     */
    cloneObj(original) {
        return Object.create(
            Object.getPrototypeOf(original),
            Object.getOwnPropertyDescriptors(original)
        );
    },

    /**
     * @typedef Point
     * @property {number} row
     * @property {string} col
     *
     * @param {string} point
     * @returns {Point}
     */
    parsePoint(point) {
        const ret = point.match(/^([A-Z]+)(\d+)/);

        return { row: parseInt(ret[2]) - 1, col: ret[1] };
    },

    /**
     * @param {any} x
     * @returns {any}
     */
    noOperation(x) {
        return x;
    },

    /**
     * @param {string} str
     * @returns {number}
     */
    excelTitleToNumber(str) {
        const getASCII = x => x.charCodeAt(0) - 65;

        return [...str].reduce(
            (prev, curr) => prev * 26 + getASCII(curr) + 1,
            0
        );
    },

    /**
     * @param {number} n
     * @returns {string}
     */
    numberToExcelTitle(n) {
        const helper = (n, str) => {
            if (n === 0) {
                return str;
            }

            return helper(
                parseInt((n - 1) / 26),
                LetterList[(n - 1) % 26] + str
            );
        };

        return helper(n, '');
    },

    /**
     * @param {number} additionRow
     * @param {number} additionCol
     * @param {string} point
     * @returns {string}
     */
    changePoint(additionRow, additionCol, point) {
        const _ = this.parsePoint(point);
        const row = _.row + additionRow + 1;
        const col = R.compose(
            this.numberToExcelTitle,
            R.add(additionCol),
            this.excelTitleToNumber
        )(_.col);

        return `${col}${row}`;
    },

    /**
     * @param {string} p1
     * @param {string} p2
     * @param {object} param2
     * @param {number} param2.intervalRow
     * @param {number} param2.intervalCol
     */
    calcLengthBtwTwoPoint(p1, p2, { intervalRow = 1, intervalCol = 1 }) {
        const point1 = this.parsePoint(p1);
        const point2 = this.parsePoint(p2);

        const diff = {
            row: Math.abs(point2.row - point1.row) + 1,
            col:
                Math.abs(
                    this.excelTitleToNumber(point2.col) -
                        this.excelTitleToNumber(point1.col)
                ) + 1,
        };

        assert(
            Number.isInteger(diff.row / intervalRow),
            `row's length(${
                diff.row
            }) is not a multiple of row's interval(${intervalRow})`
        );
        assert(
            Number.isInteger(diff.col / intervalCol),
            `col's length(${
                diff.col
            }) is not a multiple of col's interval(${intervalCol})`
        );

        return { row: diff.row / intervalRow, col: diff.col / intervalCol };
    },
};
