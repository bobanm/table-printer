interface TablePrinterOptions {
    /** Minimum spacing between columns */
    spacing?: number
    /** Prints a separator line after the table header */
    hasHeader?: boolean
    /** Prints a separator line after the table body */
    hasBottomLine?: boolean
    /** Indexes of columns to be right-aligned */
    rightAlignedColumns?: number[]
    /** Inserts a separator line when value in this column changes */
    groupByColumn?: number | null
}

export const DEFAULT_OPTIONS: Required<TablePrinterOptions> = {
    spacing: 3,
    hasHeader: true,
    hasBottomLine: false,
    rightAlignedColumns: [],
    groupByColumn: null,
}

export class TablePrinter {

    private table: string[][] = []
    private columnWidth: number[] = [] // max width of each column

    public spacing = DEFAULT_OPTIONS.spacing
    public hasHeader = DEFAULT_OPTIONS.hasHeader
    public hasBottomLine = DEFAULT_OPTIONS.hasBottomLine
    public rightAlignedColumns = DEFAULT_OPTIONS.rightAlignedColumns
    public groupByColumn = DEFAULT_OPTIONS.groupByColumn

    /**
     * Adds initial rows and modifies default formatting properties.
     * @param rows - array of arrays, each representing a row
     * @param options - formatting options
     */
    constructor(
        rows?: unknown[][],
        options: TablePrinterOptions = {},
    ) {
        Object.assign(this, options)

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
        const separator = '-'.repeat(this.width) + '\n'
        let previousValue: unknown = null

        for (const [ir, row] of this.table.entries()) {
            // draw a separator line after the header
            if (ir === 1 && this.hasHeader) {
                tableString += separator
            }

            // draw a separator line if there is a change in the observed non-header column
            if (this.groupByColumn !== null && previousValue !== row[this.groupByColumn] && !(ir === 0 && this.hasHeader)) {
                if (previousValue !== null) {
                    tableString += separator
                }
                previousValue = row[this.groupByColumn]
            }

            let rowString = ''

            for (const [ie, element] of row.entries()) {
                const isRightAlignedColumn = this.rightAlignedColumns.includes(ie)
                rowString += isRightAlignedColumn ? element.padStart(this.columnWidth[ie]!) : element.padEnd(this.columnWidth[ie]!)

                // add column spacing if it is not the last column
                if (ie < row.length - 1) {
                    rowString += ' '.repeat(this.spacing)
                }
            }

            tableString += rowString + '\n'
        }

        if (this.hasBottomLine) {
            tableString += separator
        }

        return tableString
    }
}
