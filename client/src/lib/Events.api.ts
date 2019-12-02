export const FetchAllEvents = () => {
  return fetch('http://localhost:3333/events')
    .then((x) => x.json())
}

export const CreateNewEvent = (event: any) => {
  // TODO: do validation of event
  // has name and timestamp and they're "valid"
  return fetch('http://localhost:3333/events/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event })
  })
    .then(x => x.json())
}

export const DeleteEvent = (eventId: number) => {
  return fetch(`http://localhost:3333/events/${eventId}/delete`, {
    method: 'POST'
  })
    .then((x: any) => x.json())
}

