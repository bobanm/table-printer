# CLI Table Printer

A simple, ultra lightweight class for printing beautiful minimalistic CLI tables.

```
#   TIME       SIDE   OUTCOME   SHARES   PRICE   COST $   TOT SHRS
------------------------------------------------------------------
1   21:45:18   BUY    Down       20.00   41.00     8.20      20.00
2   21:45:18   BUY    Down        5.00   41.00     2.05      25.00
3   21:45:20   BUY    Down        5.00   41.00     2.05      30.00
4   21:45:20   BUY    Down       11.98   38.00     4.55      41.98
------------------------------------------------------------------
5   21:45:20   BUY    Up          5.00   60.00     3.00       5.00
6   21:45:20   BUY    Up         20.00   60.00    12.00      25.00
7   21:45:20   BUY    Up         12.24   59.00     7.22      37.24
```


## Why publishing it?

I noticed that pretty much every CLI project of mine had a need to format and print nice tables. So it made sense to avoid code duplication and move it to an external package. I wanted something that is simple, lightweight and easy to use. I figured out the other devs might find it useful, too.


## How to use it?

Add the package to your project:

```shell
bun add @bobanm/table-printer
```

Then import it in the file which formats/prints a table:

```typescript
import { TablePrinter } from '@bobanm/table-printer'
```

Create a new table and provide headers in the constructor.

```typescript
const tradesTable = new TablePrinter([
    ['#', 'TIME', 'SIDE', 'OUTCOME', 'SHARES', 'PRICE', 'COST $', 'TOT SHRS'],
])
```

By default, your table will

1. use spacing of 3 characters between columns
1. separate header from the body using a line
1. not print a line after the last row
1. align all columns to the left
1. not group rows by the value of a certain column
1. not repeat header row at the bottom

You can override those default values by providing an options object in the constructor:

```typescript
const tradesTable = new TablePrinter(
    [
        ['#', 'TIME', 'SIDE', 'OUTCOME', 'SHARES', 'PRICE', 'COST $', 'TOT SHRS'],
    ],
    {
        columnSpacing: 4,
        hasHeader: false,
        repeatHeaderAtBottom: false,
        hasBottomLine: true,
        rightAlignedColumns: [0, 4, 5, 6, 7],
        groupByColumn: 3,
    },
)
```

Those are all public properties, so you can also change them at any time using:

```typescript
tradesTable.columnSpacing = 4
tradesTable.hasHeader = false
tradesTable.repeatHeaderAtBottom = false
tradesTable.hasBottomLine = true
tradesTable.rightAlignedColumns = [0, 4, 5, 6, 7]
tradesTable.groupByColumn = 3
```

When `hasHeader` is false in the constructor, `repeatHeaderAtBottom` is disabled.

If the contents of the table are provided in advance, you can also add them as additional arrays in the constructor. Otherwise, you can add them later using `addRow()` method:

```typescript
const trades = [
    { time: '21:45:18', side: 'BUY', outcome: 'Down', shares: 20, price: 0.41, totalShares: 20 },
    { time: '21:45:20', side: 'BUY', outcome: 'Up', shares: 5, price: 0.60, totalShares: 5 },
]

for (const [index, trade] of trades.entries()) {
    tradesTable.addRow([
        index + 1,
        trade.time,
        trade.side,
        trade.outcome,
        trade.shares.toFixed(2),
        (trade.price * 100).toFixed(2),
        (trade.shares * trade.price).toFixed(2),
        trade.totalShares.toFixed(2),
    ])
}
```

To add a manual separator row to your table, simply add an empty row to your table:

```typescript
tradesTable.addRow([])
```

An explicit separator is not printed next to an adjacent automatic header, group, or bottom separator.

Consecutive explicit separators are preserved. `null` and `undefined` cells are rendered as empty strings. Rows containing only `null`, `undefined`, or empty strings are ignored. An empty array (`[]`) still inserts a separator.

Finally, to format the table to a string and print it in the console, use `toString()` method:

```typescript
console.log(tradesTable.toString())
```

`toString()` includes a trailing newline for non-empty tables. `console.log()` adds another newline, leaving a blank line between the table and subsequent output.

## Development and publishing

```shell
bun run typecheck
bun run test
bun run build
```

Type checking uses `tsconfig.json` for the library and tests without writing files.
The build independently compiles only `table-printer.ts`, generating `dist/table-printer.js`
and `dist/table-printer.d.ts`. The ignored `dist/` directory is included in the npm package.

The package exports ES modules for Node.js and Bun. Consumers do not need TypeScript installed to run it.

After updating the package version, inspect the package contents and publish:

```shell
npm pack --dry-run
npm publish --access public
```

The `prepack` hook runs the build automatically before packing or publishing so the package contains current generated files.
