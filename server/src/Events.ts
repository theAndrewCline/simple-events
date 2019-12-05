import path from 'path'
import sqlite3, { Database } from 'sqlite3'
import { Event } from '../../types/Model'

const db: Database = new sqlite3.Database(
  path.resolve(__dirname, '../../db/events.db')
)

// setupTable :: creates table if it doesn't already exist
export const setupTable = () => (
  db.run(
    `CREATE TABLE IF NOT EXISTS events (
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )`
  )
)

type getAllEvents = () => Promise<Event[]>
export const getAllEvents: getAllEvents = () => {
  return new Promise((resolve, reject) => {
    db.all('select * from events', (err, rows) => {
      if (err) return reject(err)
      resolve(rows)
    })
  })
}

type updateEventById = (e: Event) => Promise<any>
export const updateEventById: updateEventById = ({ id, name, timestamp }: Event) => {
  return new Promise((resolve, reject) => {
    const sql = 'update events set name = ?, timestamp = ? where id = ?'
    const values = [name, timestamp, id]
    db.all(sql, values, (err, rows) => {
      if (err) return reject(err)
      resolve(rows)
    })
  })
}

type createEvent = (e: { name: string, timestamp: string }) => Promise<Event>
export const createEvent: createEvent = ({ name, timestamp }) => {
  return new Promise((resolve, reject) => {
    const sql = 'insert into events (name, timestamp) values (?, ?)'
    const values = [name, timestamp]
    db.run(sql, values, function (err: Error) {
      if (err) return reject(err)
      resolve({ id: this.lastID, name, timestamp })
    })
  })
}

const deleteById = (id: string) => new Promise((resolve, reject) => {
  const sql = 'delete from events where id = ?'
  const values = [id]
  db.run(sql, values, function (err: Error) {
    if (err) return reject(err)
    resolve({ message: `Successfully deleted event ${id}` })
  })
})

export default {
  getAll: getAllEvents,
  create: createEvent,
  updateById: updateEventById,
  setupTable: setupTable,
  deleteById
}
