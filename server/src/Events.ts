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

// getAllEvents :: Monoid? -> does something with the data
export const getAllEvents = (callback: (a: Event[] | Error) => void) => {
  db.all('select * from events', (err, rows) => {
    if (err) {
      callback(err)
    } else {
      callback(rows)
    }
  })
}

// getEventById :: Id -> Monoid? -> void
// maybe consider making a curried function?
export const getEventById = (
  id: number,
  callback: (a: Event | Error) => void
) => {
  db.get('select * from events where id = ?', [id], (err, row) => {
    if (err) {
      callback(err)
    } else {
      callback(row)
    }
  })
}

// updateEventById :: Id -> Callback -> void
export const updateEventById = ({ id, name, timestamp }: Event, callback: (a: Error | Event[]) => void) => {
  db.all('update events set name = ?, timestamp = ? where id = ?', [name, timestamp, id], (err, rows) => {
    if (err) {
      callback(err)
    } else {
      callback(rows)
    }
  })
}

type createEvent = (e: { name: string, timestamp: string }) => Promise<Event>
export const createEvent: createEvent = async ({ name, timestamp }) => {
  return new Promise((resolve, reject) => {
    db.run('insert into events (name, timestamp) values (?, ?)', [name, timestamp], function (err: Error) {
      if (err) {
        reject(err)
      } else {
        resolve({
          id: this.lastID,
          name,
          timestamp
        })
      }
    })
  })
}

export default {
  getAll: getAllEvents,
  getById: getEventById,
  create: createEvent,
  updateById: updateEventById,
  setupTable: setupTable
}
