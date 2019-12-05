import path from 'path'
import sqlite3, { Database } from 'sqlite3'
import { Event } from '../../types/Model'

const db: Database = new sqlite3.Database(
  path.resolve(__dirname, '../../db/events.db')
)

export const setupTable = async () => {
  const sql = `CREATE TABLE IF NOT EXISTS events (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    timestamp TEXT NOT NULL
  )`
  await runSql(sql, [])
}

type getAllEvents = () => Promise<any>
export const getAllEvents: getAllEvents = async () => {
  const sql = 'select * from events'
  const { rows } = await runSql(sql, [])
  return rows
}

type updateEventById = (e: Event) => Promise<any>
export const updateEventById: updateEventById = async ({ id, name, timestamp }: Event) => {
  const sql = 'update events set name = ?, timestamp = ? where id = ?'
  const values = [name, timestamp, id]
  const { rows }  = await runSql(sql, values)
  return rows
}

type createEvent = (e: { name: string, timestamp: string }) => Promise<Event>
export const createEvent: createEvent = async ({ name, timestamp }) => {
  const sql = 'insert into events (name, timestamp) values (?, ?)'
  const values = [name, timestamp]
  const { lastID } = await runSql(sql, values)
  return { id: lastID, name, timestamp }
}

const deleteById = async (id: string) => {
  const sql = 'delete from events where id = ?'
  await runSql(sql, [id])
  return { message: `Successfully deleted event ${id}` }
}

const runSql = (sql: string, values: any[]): Promise<any> => new Promise (
  (resolve, reject) => {
    db.all(sql, values, function (err: Error, rows: any) {
      if (err) return reject(err)
      // @ts-ignore-line
     const lastID = this.lastID || null
      resolve({ lastID, rows })
    })
  }
)

export default {
  getAll: getAllEvents,
  create: createEvent,
  updateById: updateEventById,
  setupTable: setupTable,
  deleteById
}
