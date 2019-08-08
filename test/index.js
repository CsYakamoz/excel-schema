/* eslint-disable no-unused-vars */
const path = require('path');
const {
    Schema: { array, date, boolean, custom, number, string },
    Executor,
} = require('../index');

const file = path.join(__dirname, 'demo.xlsx');

const showMsg = false;
const output = data => {
    if (showMsg) {
        console.log(JSON.stringify(data, null, 4));
    }
};

describe('excel-schema', () => {
    it('single', () => {
        const data = Executor(
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
        output(data);
    });

    it('before', () => {
        const data = Executor(
            file,
            {
                no: number()
                    .before(x => x - 1)
                    .point('A2'),
                firstName: string()
                    .before(x => x.toLowerCase())
                    .point('B2'),
                lastName: string()
                    .before(x => x.toUpperCase())
                    .point('C2'),
                gender: string().point('D2'),
                country: string()
                    .before(x => x + ' in Earth')
                    .point('E2'),
                age: number()
                    .before(x => x * 2)
                    .point('F2'),
                date: date()
                    .before(x => x + 1)
                    .point('G2'),
                id: string()
                    .before(x => x * 100)
                    .point('H2'),
            },
            { sheet: 'Sheet1' }
        );
        output(data);
    });

    it('after', () => {
        const data = Executor(
            file,
            {
                no: number()
                    .after(x => x + 10)
                    .point('A2'),
                firstName: string()
                    .after(x => x.toUpperCase())
                    .point('B2'),
                lastName: string()
                    .after(x => x.toLowerCase())
                    .point('C2'),
                gender: string()
                    .after(x => (x === 'Male' ? 'm' : 'f'))
                    .point('D2'),
                country: string()
                    .after(x => 'beautiful ' + x)
                    .point('E2'),
                age: number()
                    .after(x => x * 3)
                    .point('F2'),
                date: date()
                    .after(
                        x =>
                            x.getFullYear() +
                            '-' +
                            (x.getMonth() + 1) +
                            '-' +
                            x.getDate()
                    )
                    .point('G2'),
                id: string()
                    .after(x => x / 100)
                    .point('H2'),
            },
            { sheet: 'Sheet1' }
        );
        output(data);
    });

    it('array', () => {
        const data = Executor(
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
        output(data);
    });

    it('array in array', () => {
        const data = Executor(
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
        output(data);
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

        const data = Executor(
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
        output(data);
    });

    it('array in array with multiple line', () => {
        const data = Executor(
            file,
            array()
                .range('A1', 'F6')
                .interval(2, 2)
                .item(
                    array()
                        .range('A1', 'B2')
                        .item(string().point('A1'))
                ),
            { sheet: 'Sheet4' }
        );
        output(data);
    });

    it('array in array with multiple line and empty row & col', () => {
        const data = Executor(
            file,
            array()
                .range('A1', 'I8')
                .interval(3, 3)
                .item(
                    array()
                        .range('A1', 'B2')
                        .item(string().point('A1'))
                ),
            { sheet: 'Sheet5' }
        );
        output(data);
    });

    it('array in array with after', () => {
        const data = Executor(
            file,
            array()
                .range('A1', 'F6')
                .interval(2, 2)
                .item(
                    array()
                        .range('A1', 'B2')
                        .item(string().point('A1'))
                )
                .after(arr => {
                    return arr.map(_ => _.join('__'));
                }),
            { sheet: 'Sheet4' }
        );
        output(data);
    });
});
