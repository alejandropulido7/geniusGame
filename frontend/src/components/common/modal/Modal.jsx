import React from 'react'

const Modal = ({open, onClose, children}) => {
  return (
    <>
    {open && 
    <div className={`z-10 fixed inset-0 flex justify-center items-center transition-colors 
      ${open ? 'visible bg-black/20' : 'invisible'}  
      `}>
          <div className={`flex items-center justify-center bg-white rounded-xl shadow transition-all ${open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`} 
                style={{width: '70dvh', height: '70dvh'}}
                onClick={(e) => e.stopPropagation()}>
                  {/* <button onClick={() => onClose(false)} className='absolute top-2 right-2 p-1 rounded-lg 
                  text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600'>X</button> */}
              {children}
          </div>      
    </div>}
    </>
  )
}

export default Modal
