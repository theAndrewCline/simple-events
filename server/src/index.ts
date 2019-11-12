import express from 'express'
import Events from './Events'
import { Event } from '../../types/Model'
import cors from 'cors'

const port = 3333
const app = express()

app.use(cors())
app.use(express.json())

app.get('/events', (req, res) => {

  const eventsCB = (services: Error | Event[]) => {
    if (services instanceof Error) {
      res.set(500)
      res.send(services)
    } else {
      res.send({ services })
    }
  }

  Events.getAll(eventsCB)
})


app.listen(port, () => {
  console.log(`listening at port ${port}`)
})
