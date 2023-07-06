
export const admins = { 'admin': 'qwerty' }

//-------------------DB------------------------+
export enum TABLE { BLOGS = 0, POSTS = 1 }
let data: Array<Array<object | null>> = [[], []]
let increment: number[] = [0, 0]
//-------------------DB------------------------+

export class DB {

    create(table: number, input: object) {
        data[table].push(input)
        //while (this.exists(table, increment[table].toString())) {
            increment[table]++
        //}
    }

    /*
    createAtID(table: number, id: string, input: object) {
        if (this.exists(table, id)) {
            return
        }
        const index: number = parseInt(id, 10)

        if (isFinite(index)) {
            data[table][index] = input
        }
    }
    */

    get(table: number, id: string): object | null {
        if (this.exists(table, id)) {
            return data[table][+id]
        }
            return null
    }

    getAll(table: number): Array<object | null> {
        return data[table].filter(o => o !== null)
    }

    getProperty(table: number, id: string, property: string) {
        if (this.exists(table, id)) {
            const entry = data[table][+id]
            // @ts-ignore
            return entry[property]
        }
        return null
    }

    update(table: number, id: string, input: object) {
        if (this.exists(table, id)) {
            data[table][+id] = Object.assign({}, data[table][+id], input)
        }
    }

    delete(table: number, id: string): number {
        if (!this.exists(table, id)) {
            return 404
        }
        data[table][+id] = null
        return 204
    }

    clearTable(table: number): number {
        data[table] = []
        increment[table] = 0
        return 204
    }

    clear(): number {
        data = [[], []]
        increment = [0, 0]
        return 204
    }

    nextID(table: number): string {
        return increment[table].toString()
    }

    exists(table: number, id: string): boolean {
        const index: number = parseInt(id, 10)
        if (!isFinite(index)) {
            return false
        }
        return !(data[table][index] === undefined || data[table][index] === null)
    }

}