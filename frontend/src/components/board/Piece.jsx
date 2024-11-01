import React, { useEffect, useState } from 'react';
import twemoji from 'twemoji'

const Piece = ({ teamName, w, h, color, emoji }) => {

  const [showSecondName, setShowSecondName] = useState(true);
  const [emojiModified, setEmojiModified] = useState(emoji);

  useEffect(() => {
    const text = teamName.split(""); 
    if(text.length > 8){
      setShowSecondName(false);
    }
    if(emoji){
      setEmojiModified(twemoji.parse(emoji));
    }
  },[teamName, color, emoji]);

  return (
    <div className='circle-piece relative border-2 rounded-full flex justify-center items-center z-10'
    style={{width: w+'px', 
      height: h+'px', 
      backgroundColor: `${color}`,
      fontSize: `${w*0.15}px`}}>
      <div className='circle-int-piece absolute border-4 rounded-full flex items-center justify-center'
        style={{width: (w/2)+'px', height: (h/2)+'px'}}
      ><img src={emojiModified} alt="" /></div>
      <div className='text-piece absolute left-0'
        style={{top: `${w*0.3}px`,
          left: `${w*0.03}px`
        }}
        >
        <p style={{rotate: '-60deg'}}>
          {teamName.split("").map((char, i ) => {
            return <span key={i} className='absolute text-center' 
            style={{
              transform: `rotate(${i*(20)}deg)`, 
              transformOrigin: `bottom center`,
              width: `${w-(w*0.85)}px`,
              height: `${h-(w*0.51)}px`
            }}>{char}</span>
          })}
        </p>
      </div> 
      {showSecondName && 
      <div className='text-piece absolute'
        style={{top: `${w*0.7}px`,
          right: `${w*0.05}px`
        }}
        >
        <p style={{rotate: '-240deg'}}>
          {teamName.split("").map((char, i ) => {
            return <span key={i} className='absolute text-center' 
            style={{
              transform: `rotate(${i*(20)}deg)`, 
              transformOrigin: `bottom center`,
              width: `${w-(w*0.92)}px`,
              height: `${h-(w*0.55)}px`
            }}>{char}</span>
          })}
        </p>
      </div>}     
    </div>
  );
};

export default Piece;