import path from 'path'
import sqlite3, { Database } from 'sqlite3'
import { Service } from '../../types/Model'

const db: Database = new sqlite3.Database(path.resolve(__dirname, '../../db/services.db'))

// getAllServices :: Monoid? -> does something with the data
export const getAllServices = (callback: (a: Service[] | Error) => void) => {
  db.all('select * from services', (err, rows) => {
    if (err) {
      callback(err)
    } else {
      callback(rows)
    }
  })
}

// getServiceById :: Id -> Monoid? -> void
// maybe consider making a curried function? 
export const getServiceById = (id: number, callback: (a: Service | Error) => void) => {
  db.get('select * from services where id = ?', [id], (err, row) => {
    if (err) {
      callback(err)
    } else {
      callback(row)
    }
  })
}

// updateServiceById :: Id -> Callback -> void
export const updateServiceById = ({ id, name }: Service, callback: (a: Error | Service[]) => void) => {
  db.all('update services set name = ? where id = ?', [name, id], (err, rows) => {
    if (err) {
      callback(err)
    } else {
      callback(rows)
    }
  })
}

// createService :: Service -> Sucess || Failure
export const createService = ({ name }: { name: string }, callback: (a: Error | Service) => void) => {
  db.run('insert into services (name) values (?)', [name], function (err: Error) {
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
  getAll: getAllServices,
  getById: getServiceById,
  create: createService,
  updateById: updateServiceById
}