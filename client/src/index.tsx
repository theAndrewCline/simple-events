import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
// this seems to be an eslint error on tsx files.
import { Model, Event } from '../../types/Model'

type AppState = 'Loading' | 'Error' | Model

const App = () => {
  const [appState, updateAppState] = useState<AppState>('Loading')

  useEffect(() => {
    fetch('http://localhost:3333/events')
      .then((x) => x.json())
      .then(x => {
        console.log(x)
        return x
      })
      .then((model: Model | Error) => {
        if (model instanceof Error) {
          console.error(model)
          updateAppState('Error')
        } else {
          updateAppState(model)
        }
      })
      .catch((err) => {
        console.error(err)
        updateAppState('Error')
      })
  }, [])

  switch (appState) {
    case 'Loading':
      return <LoadingView />
    case 'Error':
      return <ErrorView />
    default:
      return <DefaultView events={appState.events} />
  }
}

const LoadingView = () => (<h1>Loading...</h1>)

const ErrorView = () => (<h1>Error</h1>)

const DefaultView = ({ events }: { events: Event[] }) => (
  <>
    <PlansHeaderView />
    {
      events.map((event: Event) => (
        <EventView key={event.id} event={event} />
      ))
    }
  </>
)

const PlansHeaderView = () => (
  <div className='flex bg-gray-700 items-center p-2'>
    <h1 className='text-4xl text-gray-100 mr-auto'>Events</h1>
    <button className='btn btn-green'>New Event</button>
  </div>
)

const EventView = ({ event }: { event: Event }) => (
  <div className='flex bg-gray-200 rounded mt-2 mr-2 ml-2 p-2 items-center'>
    <h1 className='text-3xl mr-auto'>{event.name}</h1>
    {/* commenting this out for now, but this is what the service date should look like */}
    {/* <p className='mr-auto ml-2 text-gray-700'>11/21/19</p> */}
    <button className='btn btn-blue mr-2'>Edit</button>
    <button className='btn btn-red'>Delete</button>
  </div>
)

ReactDOM.render(<App />, document.querySelector('#root'))
