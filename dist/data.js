"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = exports.TABLE = exports.admins = void 0;
exports.admins = { 'admin': 'qwerty' };
//-------------------DB------------------------+
var TABLE;
(function (TABLE) {
    TABLE[TABLE["BLOGS"] = 0] = "BLOGS";
    TABLE[TABLE["POSTS"] = 1] = "POSTS";
})(TABLE = exports.TABLE || (exports.TABLE = {}));
let data = [[], []];
let increment = [0, 0];
//-------------------DB------------------------+
class DB {
    create(table, input) {
        data[table].push(input);
        //while (this.exists(table, increment[table].toString())) {
        increment[table]++;
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
    get(table, id) {
        if (this.exists(table, id)) {
            return data[table][+id];
        }
        return null;
    }
    getAll(table) {
        return data[table].filter(o => o !== null);
    }
    getProperty(table, id, property) {
        if (this.exists(table, id)) {
            const entry = data[table][+id];
            // @ts-ignore
            return entry[property];
        }
        return null;
    }
    update(table, id, input) {
        if (this.exists(table, id)) {
            data[table][+id] = Object.assign({}, data[table][+id], input);
        }
    }
    delete(table, id) {
        if (!this.exists(table, id)) {
            return 404;
        }
        data[table][+id] = null;
        return 204;
    }
    clearTable(table) {
        data[table] = [];
        increment[table] = 0;
        return 204;
    }
    clear() {
        data = [[], []];
        increment = [0, 0];
        return 204;
    }
    nextID(table) {
        return increment[table].toString();
    }
    exists(table, id) {
        const index = parseInt(id, 10);
        if (!isFinite(index)) {
            return false;
        }
        return !(data[table][index] === undefined || data[table][index] === null);
    }
}
exports.DB = DB;
