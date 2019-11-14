import React from 'react'
import '../css/Modal.css'

export const Modal = ({ visable, toggleModal }: { visable: boolean, items?: any[], toggleModal: any }) => {
  if (visable) {
    return (
      <div className='fixed pin z-50 overflow-auto bg-color-smoke flex'>
        <div className='relative p-8 bg-white w-full max-w-md m-auto flex-col flex'>
          <h1>Hi I'm a modal</h1>
          <button className='btn btn-blue' onClick={() => toggleModal(false)}>Add</button>
        </div>
      </div>
    )
  } else {
    return null
  }
}
