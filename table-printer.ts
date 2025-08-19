export class TablePrinter {

    private table: string[][] = []
    private columnWidth: number[] = [] // max width of each column

    /**
     * Adds initial rows and modifies default formatting properties.
     * @param rows - array of arrays, each representing a row
     * @param spacing - minimum spacing between columns
     * @param hasHeader - prints a --- line after table header
     * @param hasBottomLine - prints a --- line after table body
     */
    constructor(rows?: unknown[][], public spacing = 3, public hasHeader = true, public hasBottomLine = false) {

        if (rows) {
            for (const row of rows) {
                this.addRow(row)
            }
        }
    }

    /**
     * Calculates the total width of the table, including spacing between columns.
     */
    get width() {

        let totalWidth = 0

        for (const cw of this.columnWidth) {
            totalWidth += cw
        }

        return totalWidth + (this.columnWidth.length - 1) * this.spacing
    }

    /**
     * Converts every input element to string type and calculates max width of each column.
     * @param row - table row
     */
    public addRow(row: unknown[]) {

        const stringRow: string[] = []

        for (const [i, v] of row.entries()) {
            if (v === undefined || v === null) {
                stringRow.push('')

                continue
            }

            const element = String(v)
            stringRow.push(element)
            if (!this.columnWidth[i] || element.length > this.columnWidth[i]) {
                this.columnWidth[i] = element.length
            }
        }

        this.table.push(stringRow)
    }

    /**
     * Adds the necessary paddings and renders the table in string format.
     * @returns table in string format
     */
    public toString(): string {

        let tableString = ''
        const line = '-'.repeat(this.width) + '\n'

        for (const [ir, row] of this.table.entries()) {
            // draw a line after the header
            if (ir === 1 && this.hasHeader) {
                tableString += line
            }

            let rowString = ''

            for (const [ie, element] of row.entries()) {
                rowString += element.padEnd(this.columnWidth[ie]!)

                // add column spacing if it is not the last column
                if (ie < row.length - 1) {
                    rowString += ' '.repeat(this.spacing)
                }
            }

            tableString += rowString + '\n'
        }

        if (this.hasBottomLine) {
            tableString += line
        }

        return tableString
    }
}
