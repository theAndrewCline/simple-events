interface Model {
  services: Service[] // list of service names
}

export interface Service {
  id: number
  name: string
}
