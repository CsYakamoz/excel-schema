const R = require('ramda');
const path = require('path');
const {
    Schema: { array, date, boolean, custom, number, string },
    Executor,
} = require('../index');

const file = path.join(__dirname, 'demo.xlsx');

describe('excel-schema', () => {
    it('single', () => {
        Executor(
            file,
            {
                no: number().point('A2'),
                firstName: string().point('B2'),
                lastName: string().point('C2'),
                gender: string().point('D2'),
                country: string().point('E2'),
                age: number().point('F2'),
                date: date().point('G2'),
                id: string().point('H2'),
            },
            { sheet: 'Sheet1' }
        );
    });

    it('array', () => {
        Executor(
            file,
            array()
                .range('A2', 'H10')
                .interval(1, 8)
                .item({
                    no: number().point('A2'),
                    firstName: string().point('B2'),
                    lastName: string().point('C2'),
                    gender: string().point('D2'),
                    country: string().point('E2'),
                    age: number().point('F2'),
                    date: date().point('G2'),
                    id: string().point('H2'),
                }),
            { sheet: 0 }
        );
    });

    it('array in array', () => {
        Executor(
            file,
            array()
                .range('A2', 'E10')
                .interval(1, 5)
                .item({
                    no: number().point('A2'),
                    name: string().point('B2'),
                    favoriteFruits: array()
                        .range('C2', 'E2')
                        .interval(1, 1) // this line is optional
                        .item(string().point('C2')),
                }),
            { sheet: 'Sheet2' }
        );
    });

    it('custom schema', () => {
        const intervalSchema = custom(intervalStr => {
            const pattern = /([([]{1})(\d+),\s*(\d+)([)\]]{1})/;
            const [, leftBracket, start, end, rightBracket] = intervalStr.match(
                pattern
            );
            const getBoundary = (value, bracket) => {
                const includedList = ['[', ']'];
                return {
                    value: Number(value),
                    includes: includedList.includes(bracket),
                };
            };

            return [
                getBoundary(start, leftBracket),
                getBoundary(end, rightBracket),
            ];
        });

        Executor(
            file,
            array()
                .range('A2', 'B5')
                .interval(1, 2)
                .item({
                    interval: intervalSchema().point('A2'),
                    discount: number().point('B2'),
                }),
            { sheet: 2 }
        );
    });
});
