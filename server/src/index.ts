import express from 'express'
import Events, { createTable } from './Events'
import { Event } from '../../types/Model'
import cors from 'cors'

const port = 3333
const app = express()

app.use(cors())
app.use(express.json())

createTable()

app.get('/events', (req, res) => {

  const eventsCB = (events: Error | Event[]) => {
    if (events instanceof Error) {
      console.log(events)
      res.set(500)
      res.send(new Error('server error'))
    } else {
      res.send({ events })
    }
  }

  Events.getAll(eventsCB)
})


app.listen(port, () => {
  console.log(`listening at port ${port}`)
})
