export interface Model {
  events: Event[] // list of service names
}

export interface Event {
  id: number
  name: string
  timestamp: string
}
