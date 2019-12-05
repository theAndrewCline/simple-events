import React, { useEffect, useState } from 'react'

import { Model, Event } from '../../types/Model'
import { Modal } from './components/Modal'
import { CreateNewEvent, FetchAllEvents, DeleteEvent, UpdateEvent } from './lib/Events.api'

type EventsPageState = 'Loading' | 'Error' | Model

const refreshEventList = async (updateAppState: any) => {
  return FetchAllEvents()
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
}
export const EventsPage = () => {
  const [appState, updateAppState] = useState<EventsPageState>('Loading')
  const [showModal, toggleModal] = useState<boolean>(false)

  useEffect(() => {
    refreshEventList(updateAppState)
  }, [])

  switch (appState) {
    case 'Loading':
      return <LoadingView />
    case 'Error':
      return <ErrorView />
    default:
      return <DefaultView
        events={appState.events}
        showModal={showModal}
        toggleModal={toggleModal}
        update={updateAppState} />
  }
}

const LoadingView = () => (<h1>Loading...</h1>)

const ErrorView = () => (<h1>Error</h1>)

const dateInputValue = (isoTimestamp: string) => {
  const dt = new Date(isoTimestamp)
  const year = dt.getFullYear()
  const month = dt.getMonth() + 1
  const day = String(dt.getDate()).padStart(2, '0')
  const hour = String(dt.getHours()).padStart(2, '0')
  const minute = String(dt.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hour}:${minute}`
}
type NewEventModalContentProps = { toggleModal: any, update: any }
const NewEventModalContent = ({ toggleModal, update }: NewEventModalContentProps) => {
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
              toggleModal(false)
              refreshEventList(update)
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
const EditEventModalContent = ({ toggleModal, timestamp, name, id, update }: any) => {
  const [eventName, setEventName] = useState(name)
  const [eventTime, setEventTime] = useState(timestamp)
  return (
    <>
      <h1>Edit Event</h1>
      <label>
        Name:
        <input
          type="text"
          value={eventName}
          onChange={evt => setEventName(evt.target.value)} />
      </label>
      <label>
        Date
        <input
          type="datetime-local"
          value={dateInputValue(eventTime)}
          onChange={evt => {
            const isoDatetime = new Date(evt.target.value).toISOString()
            setEventTime(isoDatetime)
          }} />
      </label>
      <button
        className="btn btn-blue"
        onClick={async () => {
          try {
            await UpdateEvent({ id, timestamp: eventTime, name: eventName })
            await refreshEventList(update)
            toggleModal(false)
          } catch (err) {
            console.log(err)
            // TODO: inform user of problem
            toggleModal(false)
          }
        }}>
        Update
      </button>
    </>
  )
}
type DefaultViewProps = { events: Event[], showModal: any, toggleModal: any, update: any }
type DefaultView = (props: DefaultViewProps) => JSX.Element
const DefaultView: DefaultView = ({ events, showModal, toggleModal, update }) => {
  return (
    <>
      <div className='flex flex-col justify-center'>
        <PlansHeaderView toggleModal={toggleModal} />
        {
          (events.length > 0)
            ? events.map((event: Event) => (<EventView key={event.id} event={event} update={update} />))
            : <h1 className='mr-auto ml-auto text-gray-700 text-xl p-2'>Add some events!</h1>
        }
      </div>
      <Modal visible={showModal}>
        <NewEventModalContent 
          toggleModal={toggleModal}
          update={update}
        />
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

const EventView = ({ event, update }: any) => {
  const [showModal, toggleModal] = useState<boolean>(false)

  return (
    <>
      <div className='flex bg-gray-200 rounded mt-2 mr-2 ml-2 p-2 items-center'>
        <h1 className='text-3xl mr-auto'>{event.name}</h1>
        {/* commenting this out for now, but this is what the service date should look like */}
        {/* <p className='mr-auto ml-2 text-gray-700'>11/21/19</p> */}
        <button className='btn btn-blue mr-2' onClick={() => toggleModal(true)}>Edit</button>
        <button className='btn btn-red' onClick={async () => {
          try {
            await DeleteEvent(event.id)
            await refreshEventList(update)
          } catch (err) {
            console.log(err)
            // TODO: inform user of problem
          }
        }}>
          Delete
        </button>
      </div>
      <Modal visible={showModal}>
        <EditEventModalContent
          id={event.id}
          name={event.name}
          timestamp={event.timestamp}
          update={update}
          toggleModal={toggleModal} />
      </Modal>
    </>
  )
}
