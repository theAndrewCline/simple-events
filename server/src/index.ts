import express from 'express'
import Events from './Events'
import { Event } from '../../types/Model'
import cors from 'cors'

const port = 3333
const app = express()

app.use(cors())
app.use(express.json())

Events.setupTable()

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

app.post('/events/create', async (req, res) => {
  const { name, timestamp } = req.body.event
  try {
    const newEvent = await Events.create({ name, timestamp })
    res.send(newEvent)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.post('/events/:id/update', async (req, res) => {
  const id = Number(req.params.id)
  const { name, timestamp } = req.body.event
  try {
    const response = await Events.updateById({ id, name, timestamp })
    res.send(response)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.post('/events/:id/delete', async (req, res) => {
  const { id } = req.params
  try {
    const response = await Events.deleteById(id)
    res.send(response)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.listen(port, () => {
  console.log(`listening at port ${port}`)
})
