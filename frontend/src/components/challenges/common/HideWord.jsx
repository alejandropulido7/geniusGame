import React, { useState } from 'react'

const HideWord = ({word, textButton = 'Ver la palabra secreta'}) => {

    const [showWord, setShowWord] = useState(false);

    const manageHold = () => {
        setShowWord(true);
    };

    const manageUnhold = () => {
        setShowWord(false);
    };

  return (
    <div className='flex flex-col'>        
        { word != '' &&      
        <div className='order-last'>
            <button
                className='btn-wood py-2 px-6 text-white'
                onMouseDown={manageHold}
                onMouseUp={manageUnhold}
                onTouchStart={manageHold}
                onTouchEnd={manageUnhold}
            >
            {textButton}
            </button>
        </div>
        }
        <div className='order-1 py-2'>
            {showWord && <p>{word}</p>}
        </div>
        
    </div>
  )
}

export default HideWord
