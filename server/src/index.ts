import express from 'express'
import path from 'path'
import sqlite3 from 'sqlite3'

const db = new sqlite3.Database(path.resolve(__dirname, '../../db/services.db'))

// getAllServices :: Monoid? -> does something with the data
const getAllServices = (callback: (a: any) => void) => {
  db.all('select * from services', (err, rows) => {
    if (err) {
      callback(err)
    } else {
      callback(rows)
    }
  })
}

// getServiceById :: Id -> Monoid? -> does something with data 
const getServiceById = (id: number, callback: (a: any) => void) => {
  db.get('select * from services where id = ?', [id], (err, rows) => {
    if (err) {
      callback(err)
    } else {
      callback(rows)
    }
  })
}

getAllServices(console.log)
getServiceById(1, console.log)

const app = express()

const port = 3333

app.listen(port, () => {
  console.log(`listening at port ${port}`)
})
