import React, {useRef, useEffect} from 'react'
import video from '../../assets/videos/win-game-turn.mp4'

export const KeepActiveBrowser = () => {
    const videoRef = useRef(null);

    useEffect(() => {
      videoRef.current.play();
  
      return () => {
        if (videoRef.current) videoRef.current.pause();
      };
    }, []);
  
    return (
      <div>
        <video
          ref={videoRef}
          src={video}
          loop
          hidden
          muted
          playsInline
        //   style={{ width: 500, height: 100, opacity: 0}} 
        />
      </div>
    );
}