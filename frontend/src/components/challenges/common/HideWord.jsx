import React, { useState } from 'react'

const HideWord = ({word}) => {

    const [showWord, setShowWord] = useState(false);

    const manageHold = () => {
        setShowWord(true);
    };

    const manageUnhold = () => {
        setShowWord(false);
    };

  return (
    <div>   
        
        { word != '' &&      
        <div>
            <button
                className='btn'
                onMouseDown={manageHold}
                onMouseUp={manageUnhold}
                onTouchStart={manageHold}
                onTouchEnd={manageUnhold}
            >
            Ver la palabra secreta
            </button>
        </div>
        }
        <div>
            {showWord && <p>{word}</p>}
        </div>
        
    </div>
  )
}

export default HideWord
