import path from 'path'
import sqlite3, { Database } from 'sqlite3'
import { Event } from '../../types/Model'

const db: Database = new sqlite3.Database(path.resolve(__dirname, '../../db/events.db'))

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
export const getEventById = (id: number, callback: (a: Event | Error) => void) => {
  db.get('select * from events where id = ?', [id], (err, row) => {
    if (err) {
      callback(err)
    } else {
      callback(row)
    }
  })
}

// updateEventById :: Id -> Callback -> void
export const updateEventById = ({ id, name }: Event, callback: (a: Error | Event[]) => void) => {
  db.all('update events set name = ? where id = ?', [name, id], (err, rows) => {
    if (err) {
      callback(err)
    } else {
      callback(rows)
    }
  })
}

// createEvent :: Event -> Sucess || Failure
export const createEvent = ({ name }: { name: string }, callback: (a: Error | Event) => void) => {
  db.run('insert into events (name) values (?)', [name], function (err: Error) {
    if (err) {
      callback(err)
    } else {
      callback({
        id: this.lastID,
        name
      })
    }
  })
}

export default {
  getAll: getAllEvents,
  getById: getEventById,
  create: createEvent,
  updateById: updateEventById
}
