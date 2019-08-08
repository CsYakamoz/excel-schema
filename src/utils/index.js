const R = require('ramda');

const UpperLetterList = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

module.exports = {
    pointPattern: /^[a-zA-Z]+(?:[1-9]{1}\d*)$/,

    /**
     * copy a class instance
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
                UpperLetterList[(n - 1) % 26] + str
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
        const p = this.parsePoint(point);
        const row = p.row + additionRow + 1;
        const col = R.compose(
            this.numberToExcelTitle,
            R.add(additionCol),
            this.excelTitleToNumber
        )(p.col);

        return `${col}${row}`;
    },

    /**
     * @param {string} p1
     * @param {string} p2
     * @param {number} intervalRow
     * @param {number} intervalCol
     */
    calcLengthBtwTwoPoint(p1, p2, intervalRow, intervalCol) {
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

        return {
            row: Math.ceil(diff.row / intervalRow),
            col: Math.ceil(diff.col / intervalCol),
        };
    },
};
