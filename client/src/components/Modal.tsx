import React from 'react'
import '../css/Modal.css'

type ModalProps = {
  visible: boolean,
  children?: any
}
export const Modal = ({ visible, children }: ModalProps) => {
  if (!visible) return null

  return (
    <div className="fixed top-0 h-full w-full flex justify-center items-center modal">
      <div className="bg-gray-200 rounded h-64 w-full flex justify-center items-center flex-col m-64 mt-64">
        { children }
      </div>
    </div>
  )
}
