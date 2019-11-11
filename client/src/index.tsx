import React, { useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom'
import { Model, Service } from '../../types/Model'

type AppState = any

const App = () => {
  const [appState, updateAppState]: [AppState, any] = useState('Loading')

  useEffect(() => {
    fetch('http://localhost:3333/services')
      .then((x) => x.json())
      .then((services: Service[]) => {
        console.log(services)
        updateAppState(services)
      })
      .catch((err) => {
        updateAppState('Error')
        console.log(err)
      })
  }, [])

  if (appState === 'Loading') {
    return (<h1>Loading...</h1>)
  } else if (appState === 'Error') {
    return (<h1>Error</h1>)
  } else {
    return (
      <>
        {appState.services.map((service: Service) => (<h1 key={service.id}>{service.name}</h1>))}
      </>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#root'))
