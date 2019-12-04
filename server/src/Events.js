"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var path_1 = require("path");
var sqlite3_1 = require("sqlite3");
var db = new sqlite3_1["default"].Database(path_1["default"].resolve(__dirname, '../../db/events.db'));
// setupTable :: creates table if it doesn't already exist
exports.setupTable = function () { return (db.run("CREATE TABLE IF NOT EXISTS events (\n      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\n      name TEXT NOT NULL,\n      timestamp TEXT NOT NULL\n    )")); };
// getAllEvents :: callback -> does something with the data
exports.getAllEvents = function (callback) {
    db.all('select * from events', function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            callback(rows);
        }
    });
};
// getEventById :: Id -> Callback -> void
// maybe consider making a curried function?
exports.getEventById = function (id, callback) {
    db.get('select * from events where id = ?', [id], function (err, row) {
        if (err) {
            callback(err);
        }
        else {
            callback(row);
        }
    });
};
// updateEventById :: Id -> Callback -> void
exports.updateEventById = function (_a, callback) {
    var id = _a.id, name = _a.name, timestamp = _a.timestamp;
    db.all('update events set name = ?, timestamp = ? where id = ?', [name, timestamp, id], function (err, rows) {
        if (err) {
            callback(err);
        }
        else {
            callback(rows);
        }
    });
};
exports.createEvent = function (_a) {
    var name = _a.name, timestamp = _a.timestamp;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    db.run('insert into events (name, timestamp) values (?, ?)', [name, timestamp], function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve({
                                id: this.lastID,
                                name: name,
                                timestamp: timestamp
                            });
                        }
                    });
                })];
        });
    });
};
var deleteById = function (id) { return new Promise(function (resolve, reject) {
    db.run('delete from events where id = ?', [id], function (err) {
        if (err)
            return reject(err);
        resolve({ message: "Successfully deleted event " + id });
    });
}); };
exports["default"] = {
    getAll: exports.getAllEvents,
    getById: exports.getEventById,
    create: exports.createEvent,
    updateById: exports.updateEventById,
    setupTable: exports.setupTable,
    deleteById: deleteById
};
