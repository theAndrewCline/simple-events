import React, { useEffect, useState } from 'react'

import { Model, Event } from '../../types/Model'
import { Modal } from './components/Modal'
import { CreateNewEvent, FetchAllEvents } from './lib/Events.api'

type EventsPageState = 'Loading' | 'Error' | Model

export const EventsPage = () => {
  const [appState, updateAppState] = useState<EventsPageState>('Loading')
  const [showModal, toggleModel] = useState<boolean>(false)

  useEffect(() => {
    FetchAllEvents()
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
      return <DefaultView events={appState.events} showModal={showModal} toggleModal={toggleModel} />
  }
}

const LoadingView = () => (<h1>Loading...</h1>)

const ErrorView = () => (<h1>Error</h1>)

const dateInputValue = (isoTimestamp: string) => {
  const dt = new Date(isoTimestamp)
  const year = dt.getFullYear()
  const month = dt.getMonth()
  const day = dt.getDate()
  const hour = String(dt.getHours()).padStart(2, '0')
  const minute = String(dt.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hour}:${minute}`
}
type NewEventModalContentProps = { toggleModal: any }
const NewEventModalContent = ({ toggleModal }: NewEventModalContentProps) => {
  const [newEventName, setNewEventName] = useState('')
  const [newEventTime, setNewEventTime] = useState('')
  return (
    <>
      <h1>New Event</h1>
      <label>
        Name:
        <input
          type="text"
          value={newEventName}
          onChange={evt => setNewEventName(evt.target.value)} />
      </label>
      <label>
        Date
        <input
          type="datetime-local"
          value={dateInputValue(newEventTime)}
          onChange={evt => {
            const isoDatetime = new Date(evt.target.value).toISOString()
            setNewEventTime(isoDatetime)
          }} />
      </label>
      <button
        className="btn btn-blue"
        onClick={() => {
          CreateNewEvent({ timestamp: newEventTime, name: newEventName })
            .then((_newEvent) => {
              // refresh events on page?
              toggleModal(false)
            })
            .catch(err => {
              console.log(err)
              // inform user of problem?
              toggleModal(false)
            })
        }}>
        Add
      </button>
    </>
  )
}
type DefaultViewProps = { events: Event[], showModal: any, toggleModal: any }
type DefaultView = (props: DefaultViewProps) => JSX.Element
const DefaultView: DefaultView = ({ events, showModal, toggleModal }) => {
  return (
    <>
      <div className='flex flex-col justify-center'>
        <PlansHeaderView toggleModal={toggleModal} />
        {
          (events.length > 0)
            ? events.map((event: Event) => (<EventView key={event.id} event={event} />))
            : <h1 className='mr-auto ml-auto text-gray-700 text-xl p-2'>Add some events!</h1>
        }
      </div>
      <Modal visible={showModal}>
        <NewEventModalContent toggleModal={toggleModal} />
      </Modal>
    </>
  )
}

const PlansHeaderView = ({ toggleModal }: { toggleModal: any }) => (
  <div className='flex bg-gray-700 items-center p-2'>
    <h1 className='text-4xl text-gray-100 mr-auto'>Events</h1>
    <button className='btn btn-green' onClick={() => toggleModal(true)}>New Event</button>
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
