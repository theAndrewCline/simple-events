import React, { useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom'
import { Model, Service } from '../../types/Model'

type AppState = 'Loading' | 'Error' | Model

const App = () => {
  const [appState, updateAppState] = useState<AppState>('Loading')

  useEffect(() => {
    fetch('http://localhost:3333/services')
      .then((x) => x.json())
      .then((services: Model) => {
        updateAppState(services)
      })
      .catch((err) => {
        updateAppState('Error')
        console.error(err)
      })
  }, [])

  if (appState === 'Loading') {
    return (<h1>Loading...</h1>)
  } else if (appState === 'Error') {
    return (<h1>Error</h1>)
  } else {
    return (
      <>
        {
          appState.services.map((service: Service) => (
            <ServiceView key={service.id} service={service} />
          ))
        }
      </>
    )
  }
}

const ServiceView = ({ service }: { service: Service }) => {
  return (
    <>
      <h1>{service.name}</h1>
      <button>Edit</button>
      <button>Delete</button>
    </>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))
