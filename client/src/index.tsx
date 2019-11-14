import React from 'react'
import ReactDOM from 'react-dom'

import { EventsPage } from './Events.Page'

import './css/index.css'

const App = () => (
  <EventsPage />
)

ReactDOM.render(<App />, document.querySelector('#root'))
