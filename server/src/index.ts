import express from 'express'
import Services from './Services'
import { Service } from '../../types/Model'
import cors from 'cors'

const port = 3333
const app = express()

app.use(cors())
app.use(express.json())

app.get('/services', (req, res) => {
  const servicesCB = (services: Error | Service[]) => {
    if (services instanceof Error) {
      res.set(500)
      res.send({ services })
    } else {
      res.send({ services })
    }
  }

  Services.getAll(servicesCB)
})


app.listen(port, () => {
  console.log(`listening at port ${port}`)
})
