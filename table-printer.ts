interface TablePrinterOptions {
    /** Minimum spacing between columns */
    spacing?: number
    /** Prints a separator line after the table header */
    hasHeader?: boolean
    /** Prints both a separator line and table header after the table body */
    repeatHeaderAtBottom?: boolean
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
    repeatHeaderAtBottom: false,
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
    public repeatHeaderAtBottom = DEFAULT_OPTIONS.repeatHeaderAtBottom
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

        // sanitize the options
        // if the table has no header, it can't print it at the bottom
        // if needed, the user can still override this by manually setting this.repeatHeaderAtBottom = true
        if (!this.hasHeader) {
            this.repeatHeaderAtBottom = false
        }

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

        if (this.table.length === 0) {

            return ''
        }

        let tableString = ''
        let headerString = ''
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

            rowString = rowString.trimEnd()

            // save header, if it needs to be re-printed also as the footer
            if (ir === 0 && this.repeatHeaderAtBottom) {
                headerString = rowString + '\n'
            }

            tableString += rowString + '\n'
        }

        if (this.hasBottomLine || this.repeatHeaderAtBottom) {
            tableString += separator
        }

        if (this.repeatHeaderAtBottom) {
            tableString += headerString
        }

        return tableString
    }
}
