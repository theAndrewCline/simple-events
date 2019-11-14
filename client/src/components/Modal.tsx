import React from 'react'
import '../css/Modal.css'

export const Modal = ({ visable, toggleModal }: { visable: boolean, items?: any[], toggleModal: any }) => {
  if (visable) {
    return (
      <div className='fixed top-0 h-full w-full flex justify-center items-center modal'>
        <div className="bg-gray-200 rounded h-64 w-full flex justify-center items-center flex-col m-64 mt-64">
          <h1>Hi I'm a modal</h1>
          <button className='btn btn-blue' onClick={() => toggleModal(false)}>Add</button>
        </div>
      </div>
    )
  } else {
    return null
  }
}
