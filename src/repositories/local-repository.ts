
export const admins = { 'admin': 'qwerty' }

//-------------------DB------------------------+
export enum TABLE { blogs = 0, posts = 1 }
let localRepository: Array<Array<object | null>> = [[], []]
let increment: number[] = [0, 0]
//-------------------DB------------------------+

export class DB {

    async create(table: number, input: object) {
        localRepository[table].push(input)
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
            localRepository[table][index] = input
        }
    }
    */

    async get(table: number, id: string): Promise<object | null> {
        if (await this.exists(table, id)) {
            return localRepository[table][+id]
        }
        return null
    }

    async getAll(table: number): Promise<Array<object | null>> {
        return localRepository[table].filter(o => o !== null)
    }

    async getProperty(table: number, id: string, property: string) {
        if (await this.exists(table, id)) {
            const entry = localRepository[table][+id]
            // @ts-ignore
            return entry[property]
        }
        return null
    }

    async update(table: number, id: string, input: object) {
        if (await this.exists(table, id)) {
            localRepository[table][+id] = Object.assign({}, localRepository[table][+id], input)
        }
    }

    async delete(table: number, id: string): Promise<number> {
        if (!await this.exists(table, id)) {
            return 404
        }
        localRepository[table][+id] = null
        return 204
    }

    async clearTable(table: number): Promise<number> {
        localRepository[table] = []
        increment[table] = 0
        return 204
    }

    async clear(): Promise<number> {
        localRepository = [[], []]
        increment = [0, 0]
        return 204
    }

    async nextID(table: number): Promise<string> {
        return increment[table].toString()
    }

    async exists(table: number, id: string): Promise<boolean> {
        const index: number = parseInt(id, 10)
        if (!isFinite(index)) {
            return false
        }
        return !(localRepository[table][index] === undefined || localRepository[table][index] === null)
    }

}