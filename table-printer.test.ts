import { describe, expect, test } from 'bun:test'
import { TablePrinter, DEFAULT_OPTIONS, type TablePrinterOptions } from './table-printer'

describe('Table Printer', () => {

    test('Initializes with rows and options in constructor', () => {
        const rows = [
            ['Header1', 'Header2'],
            ['Value1', 'Value2'],
        ]

        const options: TablePrinterOptions = {
            columnSpacing: 5,
            hasBottomLine: true,
            rightAlignedColumns: [1],
        }

        const table = new TablePrinter(rows, options)

        expect(table.columnSpacing).toBe(5)
        expect(table.hasHeader).toBe(DEFAULT_OPTIONS.hasHeader)
        expect(table.repeatHeaderAtBottom).toBe(DEFAULT_OPTIONS.repeatHeaderAtBottom)
        expect(table.hasBottomLine).toBe(true)
        expect(table.rightAlignedColumns).toEqual([1])
        expect(table.groupByColumn).toBeNull()

        expect(table.toString()).toBe(
            'Header1     Header2\n' +
            '-------------------\n' +
            'Value1       Value2\n' +
            '-------------------\n'
        )
    })

    test('Calculates max width of each column and total width of the table', () => {
        const table = new TablePrinter([
            [123, '4567.89', false],
            ['hello', 'world', 88],
        ],
            { columnSpacing: 4 },
        )

        expect((table as any).columnWidth[0]).toBe(5)
        expect((table as any).columnWidth[1]).toBe(7)
        expect((table as any).columnWidth[2]).toBe(5)

        expect(table.width).toBe(5 + 7 + 5 + 2 * table.columnSpacing)
    })

    test('Formats the output string', () => {
        const table = new TablePrinter([
            ['one', 'two', 'three', 'four'],
            [undefined, '2.00', 3.000000, 'four'],
        ],
            { hasBottomLine: true },
        )

        expect(table.toString()).toBe(
            'one   two    three   four\n' +
            '-------------------------\n' +
            '      2.00   3       four\n' +
            '-------------------------\n'
        )
    })

    test('Aligns columns to right or left', () => {
        const table = new TablePrinter([
            ['left1', 'right1', 'right2', 'left2', 'right3'],
            [1, '2.00', 3.000000, 'four', 5],
            ['left', 'right', 'right', 'left', 'right'],
        ],
            { rightAlignedColumns: [1, 2, 4] },
        )

        expect(table.toString()).toBe(
            'left1   right1   right2   left2   right3\n' +
            '----------------------------------------\n' +
            '1         2.00        3   four         5\n' +
            'left     right    right   left     right\n'
        )
    })

    test('Does not provide any arguments in the constructor, and inserts a separator when the observed column changes value', () => {

        const table = new TablePrinter()

        table.rightAlignedColumns = [0, 4, 5, 6]
        table.groupByColumn = 3
        table.addRow(['#', 'TIME', 'SIDE', 'OUTCOME', 'SHARES', 'PRICE', 'COST $'])
        table.addRow([1, '04:00:09', 'BUY', 'Down', '216.75', '48.00', '104.04'])
        table.addRow([2, '04:00:09', 'BUY', 'Down', '68.00', '48.00', '32.64'])
        table.addRow([3, '04:00:19', 'BUY', 'Up', '10.00', '52.00', '5.20'])
        table.addRow([4, '04:00:21', 'BUY', 'Up', '15.00', '56.00', '8.40'])
        table.addRow([5, '04:00:53', 'BUY', 'Down', '10.00', '39.00', '3.90'])

        expect(table.toString()).toBe(
            '#   TIME       SIDE   OUTCOME   SHARES   PRICE   COST $\n' +
            '-------------------------------------------------------\n' +
            '1   04:00:09   BUY    Down      216.75   48.00   104.04\n' +
            '2   04:00:09   BUY    Down       68.00   48.00    32.64\n' +
            '-------------------------------------------------------\n' +
            '3   04:00:19   BUY    Up         10.00   52.00     5.20\n' +
            '4   04:00:21   BUY    Up         15.00   56.00     8.40\n' +
            '-------------------------------------------------------\n' +
            '5   04:00:53   BUY    Down       10.00   39.00     3.90\n'
        )
    })

    test('Repeats header at the bottom when repeatHeaderAtBottom is true and hasHeader is true', () => {
        const table = new TablePrinter([
            ['ID', 'NAME'],
            [1, 'Alice'],
            [2, 'Bob'],
        ],
            { repeatHeaderAtBottom: true, hasHeader: true },
        )

        expect(table.toString()).toBe(
            'ID   NAME\n' +
            '----------\n' +
            '1    Alice\n' +
            '2    Bob\n' +
            '----------\n' +
            'ID   NAME\n'
        )
    })

    test('Does not repeat header at bottom when repeatHeaderAtBottom is true, but hasHeader is false', () => {
        const table = new TablePrinter([
            ['ID', 'NAME'],
            [1, 'Alice'],
            [2, 'Bob'],
        ],
            { repeatHeaderAtBottom: true, hasHeader: false },
        )

        expect(table.toString()).toBe(
            'ID   NAME\n' +
            '1    Alice\n' +
            '2    Bob\n'
        )
    })

    test('Handles an empty table', () => {
        const emptyTable = new TablePrinter()

        expect(emptyTable.toString()).toBe('')
    })

    test('Handles a single row table', () => {
        const singleRowTable = new TablePrinter([['Header']])

        expect(singleRowTable.toString()).toBe('Header\n')
    })

    test('Prints tables with 0 column spacing', () => {
        const zeroSpacingTable = new TablePrinter([
            ['ID', 'NAME'],
            [11, 'Alice'],
            [12, 'Bob'],
        ],
            { columnSpacing: 0 }
        )

        expect(zeroSpacingTable.toString()).toBe(
            'IDNAME\n' +
            '-------\n' +
            '11Alice\n' +
            '12Bob\n'
        )
    })
})
