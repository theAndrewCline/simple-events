import React, { useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom'
// this seems to be an eslint error on tsx files.
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
        <PlansHeaderView />
        {
          appState.services.map((service: Service) => (
            <ServiceView key={service.id} service={service} />
          ))
        }
      </>
    )
  }
}

const PlansHeaderView = () => (
  <div className='flex bg-gray-700 items-center p-2'>
    <h1 className='text-4xl text-gray-100 mr-auto'>Plans</h1>
    <button className='btn btn-green'>New Plan</button>
  </div>
)

const ServiceView = ({ service }: { service: Service }) => (
  <div className='flex bg-gray-200 rounded mt-2 mr-2 ml-2 p-2 items-center'>
    <h1 className='text-3xl mr-auto'>{service.name}</h1>
    {/* commenting this out for now, but this is what the service date should look like */}
    {/* <p className='mr-auto ml-2 text-gray-700'>11/21/19</p> */}
    <button className='btn btn-blue mr-2'>Edit</button>
    <button className='btn btn-red'>Delete</button>
  </div>
)

ReactDOM.render(<App />, document.querySelector('#root'))
