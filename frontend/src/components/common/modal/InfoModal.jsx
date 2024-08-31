import React from 'react'

const InfoModal = ({title, description}) => {
  return (
    <div className='mx-auto my-4 w-full'>
        <h3 className='text-lg font-black text-gray-800'>{title}</h3>
        <p className='text-md text-gray-700'>{description}</p>
        {/* <div className='flex gap-4'>
            <button>1</button>
            <button>2</button>
        </div> */}
    </div>
  )
}

export default InfoModal
