import { beforeEach, describe, expect, test } from 'bun:test'
import { TablePrinter, DEFAULT_OPTIONS } from './table-printer'

describe('Table Printer', () => {
    let table: TablePrinter

    beforeEach(() => {
        table = new TablePrinter()
    })

    test('Calculates max width of each column and total width of the table', () => {
        table.addRow([123, '4567.89', false])
        table.addRow(['hello', 'world', 88])
        table.spacing = 4

        expect((table as any).columnWidth[0]).toBe(5)
        expect((table as any).columnWidth[1]).toBe(7)
        expect((table as any).columnWidth[2]).toBe(5)

        expect(table.width).toBe(5 + 7 + 5 + 2 * table.spacing)
    })

    test('Formats the output string', () => {
        table.addRow(['one', 'two', 'three', 'four'])
        table.addRow([undefined, '2.00', 3.000000, 'four'])
        table.hasBottomLine = true

        expect(table.toString()).toBe(
            'one   two    three   four\n' +
            '-------------------------\n' +
            '      2.00   3       four\n' +
            '-------------------------\n'
        )
    })

    test('Aligns columns to right or left', () => {
        table.rightAlignedColumns = [1, 2, 4]
        table.addRow(['left1', 'right1', 'right2', 'left2', 'right3'])
        table.addRow([1, '2.00', 3.000000, 'four', 5])
        table.addRow(['left', 'right', 'right', 'left', 'right'])

        expect(table.toString()).toBe(
            'left1   right1   right2   left2   right3\n' +
            '----------------------------------------\n' +
            '1         2.00        3   four         5\n' +
            'left     right    right   left     right\n'
        )
    })

    test('Inserts a separator when the observed column changes value', () => {
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

    test('Initializes with rows and options in constructor', () => {
        const rows = [
            ['Header1', 'Header2'],
            ['Value1', 'Value2']
        ]
        const options = {
            spacing: 5,
            hasBottomLine: true,
            rightAlignedColumns: [1]
        }
        const customTable = new TablePrinter(rows, options)

        expect(customTable.spacing).toBe(5)
        expect(customTable.hasHeader).toBe(DEFAULT_OPTIONS.hasHeader)
        expect(customTable.hasBottomLine).toBe(true)
        expect(customTable.rightAlignedColumns).toEqual([1])
        expect(customTable.groupByColumn).toBeNull()
        expect(customTable.toString()).toBe(
            'Header1     Header2\n' +
            '-------------------\n' +
            'Value1       Value2\n' +
            '-------------------\n'
        )
    })

    test('Repeats header at the bottom when repeatHeaderAtBottom is true and hasHeader is true', () => {
        table.addRow(['ID', 'NAME'])
        table.addRow([1, 'Bob'])
        table.addRow([2, 'Alice'])
        table.repeatHeaderAtBottom = true
        table.hasHeader = true

        expect(table.toString()).toBe(
            'ID   NAME \n' +
            '----------\n' +
            '1    Bob  \n' +
            '2    Alice\n' +
            '----------\n' +
            'ID   NAME \n'
        )
    })

    test('Does not repeat header at bottom when repeatHeaderAtBottom is true but hasHeader is false', () => {
        table.addRow(['ID', 'NAME'])
        table.addRow([1, 'Bob'])
        table.addRow([2, 'Alice'])
        table.repeatHeaderAtBottom = false
        table.hasHeader = false

        expect(table.toString()).toBe(
            'ID   NAME \n' +
            '1    Bob  \n' +
            '2    Alice\n'
        )
    })

    test('Does not repeat header by default', () => {
        table.addRow(['ID', 'NAME'])
        table.addRow([1, 'Bob'])
        table.addRow([2, 'Alice'])

        expect(table.toString()).toBe(
            'ID   NAME \n' +
            '----------\n' +
            '1    Bob  \n' +
            '2    Alice\n'
        )
    })

    test('Handles an empty table', () => {

        expect(table.toString()).toBe('')
    })

    test('Handles a single row table', () => {
        table.addRow(['Header'])

        expect(table.toString()).toBe('Header\n')
    })

    test('Handles spacing = 0', () => {
        table.addRow(['ID', 'NAME'])
        table.addRow([11, 'Bob'])
        table.addRow([12, 'Alice'])
        table.spacing = 0

        expect(table.toString()).toBe(
            'IDNAME \n' +
            '-------\n' +
            '11Bob  \n' +
            '12Alice\n'
        )
    })
})
