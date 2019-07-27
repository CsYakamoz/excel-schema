# Excel Schema

Read excel in a lazy way.

## Installation

```bash
npm install excel-schema
# or
yarn add excel-schema
```

## Usage

```javascript
const {
  Schema: { array, date, boolean, custom, number, string },
  Executor,
} = require('excel-schema');

const data = Executor(
  // excel file
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
  /**
   * sheet index or sheet name
   * this is optional, the default is 0
   */
  { sheet: 0 }
);

console.log(data);
```

## License

[MIT](./LICENSE)
