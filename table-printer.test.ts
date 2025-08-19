import { beforeEach, describe, expect, test } from 'bun:test'
import { TablePrinter } from './table-printer'

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
})
