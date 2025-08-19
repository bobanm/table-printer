# CLI Table Printer

A simple, ultra lightweight class for printing beautiful minimalistic CLI tables.

```
COIN   AMOUNT   B.PRICE   VALUE   LIQUID   FUNDING   PROFIT
-----------------------------------------------------------
ETH    20.0     4000.00   80000   100.00   -123      23456
SOL    200.0    200.00    40000   100.00   -55       11111
AAVE   200.0    300.00    60000   100.00   -82       15161
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
const positionsTable = new TablePrinter([
    ['COIN', 'AMOUNT', 'B.PRICE', 'VALUE', 'LIQUID', 'FUNDING', 'PROFIT'],
])
```

By default, tables use spacing of 3 characters, separates header from the body using a line, and
does not print a line after the last row. You can override those default values in the constructor:

```typescript
const positionsTable = new TablePrinter(
    [
        ['COIN', 'AMOUNT', 'B.PRICE', 'VALUE', 'LIQUID', 'FUNDING', 'PROFIT'],
    ],
    4,
    false,
    true,
)
```

Those are all public properties, so you can also change them at any time using:

```typescript
positionsTable.spacing = 4
positionsTable.hasHeader = false
positionsTable.hasBottomLine = true
```

If the contents of the table are provided in advance, you can also add them as additional arrays in
the constructor. Otherwise, you can add them later using `addRow()` method:

```typescript
for (const position of account.assetPositions) {
    positionsTable.addRow([
        position.coin,
        position.szi,
        position.entryPx,
        removeDecimals(position.positionValue),
        Number(position.liquidationPx ?? 0).toPrecision(5),
        removeDecimals(-Number(position.cumFunding.sinceOpen)),
        removeDecimals(position.unrealizedPnl),
    ])
}
```

Finally, to format the table to a string and print it in the console, use `toString()` method:

```typescript
console.log(positionsTable.toString())
```
