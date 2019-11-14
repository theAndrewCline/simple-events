export const FetchAllEvents = () => {
  return fetch('http://localhost:3333/events')
    .then((x) => x.json())
}
