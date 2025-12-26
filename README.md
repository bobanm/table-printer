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

I noticed that pretty much every CLI project of mine had a need to format and print nice tables.
So it made sense to avoid code duplication and move it to an external package. I wanted something
that is simple, lightweight and easy to use. I figured out the other devs might find it useful,
too.


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

You can override those default values in the constructor:

```typescript
const tradesTable = new TablePrinter(
    [
        ['#', 'TIME', 'SIDE', 'OUTCOME', 'SHARES', 'PRICE', 'COST $', 'TOT SHRS'],
    ],
    4,
    false,
    true,
    [0, 4, 5, 6, 7],
    3,
)
```

Those are all public properties, so you can also change them at any time using:

```typescript
tradesTable.spacing = 4
tradesTable.hasHeader = false
tradesTable.hasBottomLine = true
tradesTable.rightAlignedColumns = [0, 4, 5, 6, 7]
tradesTable.groupByColumn = 3
```

If the contents of the table are provided in advance, you can also add them as additional arrays in
the constructor. Otherwise, you can add them later using `addRow()` method:

```typescript
for (const position of account.assetPositions) {
    tradesTable.addRow([
        index + 1,
        convertToEtTimezone(trade.timestamp),
        trade.side,
        trade.outcome,
        trade.size.toFixed(2),
        (trade.price * 100).toFixed(2),
        (trade.size * trade.price).toFixed(2),
        totalShares[outcome].toFixed(2),
    ])
}
```

Finally, to format the table to a string and print it in the console, use `toString()` method:

```typescript
console.log(tradesTable.toString())
```
