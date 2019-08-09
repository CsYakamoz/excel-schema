declare type SimpleProcessFunInParserAndAfter = (
    value: any,
    rawValue?: any,
    point?: string
) => any;
declare type SimpleProcessFunInBefore = (rawValue: any, point?: string) => any;
declare type ArrayProcessFunInAfter = (value: any[]) => any[];

interface SimpleSchema {
    point(p: string): SimpleSchema;
    before(func: SimpleProcessFunInBefore): SimpleSchema;
    after(func: SimpleProcessFunInParserAndAfter): SimpleSchema;
}

interface ArraySchema {
    range(first: string, last: string): ArraySchema;
    interval(row: number, col: number): ArraySchema;
    item(schema: any): ArraySchema;
    after(func: ArrayProcessFunInAfter): ArraySchema;
}

interface ExecutorOption {
    sheet: number | string;
}

declare module '@csyakamoz/excel-schema' {
    const Executor: (
        filename: string,
        schema: any,
        userOption: ExecutorOption
    ) => any;

    const Schema: {
        array(): ArraySchema;
        boolean(): SimpleSchema;
        custom: (
            parser: SimpleProcessFunInParserAndAfter
        ) => () => SimpleSchema;
        date(): SimpleSchema;
        number(): SimpleSchema;
        string(): SimpleSchema;
    };
}
