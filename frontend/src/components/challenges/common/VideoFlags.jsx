import React from 'react'
import './VideoFlags.css';
import video_flag_red from '../../../assets/videos/gain-flag-red.mp4'

export const VideoFlags = () => {
    return (
        <div className="background-container">
          <video autoPlay muted className="background-video">
            <source src={video_flag_red} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="content">
            {/* Place other components or content here */}
            <h1>Your Content Here</h1>
          </div>
        </div>
    );
}
