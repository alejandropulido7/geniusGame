import React, {useRef, useEffect} from 'react'
import video from '../../assets/videos/video-loop.mp4'

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
          muted
          playsInline
          style={{ width: 0, height: 0, opacity: 0, display: 'none' }}
        />
      </div>
    );
}
