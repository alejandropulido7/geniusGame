import React from 'react'

const Flag = ({color, shadow}) => {


  return (
    <div>
        <svg width="67" height="59" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384">
        <path fill="none" d="M21.05.06Q200.75.06,380.43,0C383,0,384,.24,384,3.3q-.15,188.7,0,377.38c0,2.54-.32,3.32-3.18,3.32q-188.85-.15-377.7,0c-2.57,0-3.26-.5-3.06-3.08.28-3.46.07-7,.07-10.46.76,1.5,1.44,3.05,2.3,4.5A16.91,16.91,0,0,0,21,382.75a16.68,16.68,0,0,0,12.76-16.33q0-60,0-120.06c0-1.64-.63-3.34,2.38-3.33q54,.16,108.08,0c1.88,0,2.65.37,2.55,2.43-.18,3.36-.08,6.73,0,10.1.07,7-.67,14.09.43,20.9,3.36,20.73,19.23,33.89,40.4,33.92q93.87.13,187.74,0c7.17,0,9.44-3.54,6.55-10.1Q361.05,253,340.16,205.76a6.45,6.45,0,0,1,0-5.88q21.06-47.4,41.92-94.9c2.55-5.78.35-9.67-5.69-9.67q-66.57-.09-133.14,0c-4.3,0-5.88,1.46-6.86,5.77h-11c0-8.34,0-16.69-.14-25-.07-4.85.54-9.74-.38-14.54-4-20.78-19.49-33.54-40.72-33.56q-26.53,0-53.07,0c-31.38,0-62.77,0-94.16.07-2.63,0-3.38-.66-3.25-3.27a50.9,50.9,0,0,0-.22-11.18C32.28,6.56,27.26,2.67,21.05.06Z"/>
        <path fill="#130805" d="M236.4,101.07c1-4.31,2.56-5.77,6.86-5.77q66.57,0,133.14,0c6,0,8.24,3.89,5.69,9.67q-20.91,47.47-41.92,94.9a6.45,6.45,0,0,0,0,5.88q21,47.25,41.71,94.58c2.89,6.56.62,10.1-6.55,10.1q-93.87,0-187.74,0c-21.17,0-37-13.19-40.4-33.92-1.1-6.81-.36-13.93-.43-20.9,0-3.37-.14-6.74,0-10.1.1-2.06-.67-2.43-2.55-2.43q-54,.09-108.08,0c-3,0-2.38,1.69-2.38,3.33q0,60,0,120.06A16.68,16.68,0,0,1,21,382.75,16.91,16.91,0,0,1,2.4,375c-.86-1.45-1.54-3-2.3-4.5V13.53A18.92,18.92,0,0,1,13.57.06h7.48c6.21,2.61,11.23,6.5,12.44,13.49a50.9,50.9,0,0,1,.22,11.18C33.58,27.34,34.33,28,37,28c31.39-.1,62.78-.07,94.16-.07q26.53,0,53.07,0c21.23,0,36.74,12.78,40.72,33.56.92,4.8.31,9.69.38,14.54.11,8.34.1,16.69.14,25,0,1.49-.12,3-.12,4.48V270.84a39,39,0,0,1-9.23,25.4c-.58.71-1.67,1.15-1.46,2.62H349.53c1,0,2-.11,3-.17,3.86.06,7.72.16,11.57.18,4.73,0,4.74,0,2.88-4.23q-19.36-44-38.78-87.87a8.81,8.81,0,0,1,0-7.82c5.3-11.77,10.44-23.6,15.66-35.41,7.82-17.71,15.58-35.44,23.53-53.09,1.45-3.24.51-3.77-2.53-3.61-4.1.22-8.22.16-12.32.22-9.1-.06-18.19-.16-27.28-.17q-40.36,0-80.75,0C239.16,106.86,237.6,105.71,236.4,101.07Zm-43.29,196.7c11.38-2.67,19.68-12.55,20.87-24.83,1.08-11.1-5.84-22.62-16.39-27.32a11.52,11.52,0,0,0-4.48-1.69c-11.13-1.83-22.34-.44-33.5-.87-1.39-.05-1.67.72-1.63,1.88.36,10.56-1,21.19.75,31.66C161.41,292.17,178.83,302.74,193.11,297.77Zm3.65-64.92c6.24,2.32,12.11,5.3,17.31,10.53V241q0-86.79,0-173.58A27.62,27.62,0,0,0,183.39,39.7c-.5-.05-1-.16-1.48-.16q-68.82,0-137.62,0c-.64,0-1.54-.4-1.57-.28,48.39,64.59,48.34,128.25.12,192.25H172.57C180.66,231.52,188.77,231.16,196.76,232.85ZM22.54,191.73V19.7c0-5.61-1.92-8.45-5.67-8.4s-5.54,2.83-5.54,8.52v343.7c0,5.61,1.92,8.45,5.67,8.4s5.54-2.84,5.54-8.53ZM34,222.58c46.88-51.8,41.86-129.65,0-173.89Z"/>
        <path fill="#f9f9f9" d="M13.57.06A18.92,18.92,0,0,0,.1,13.53V.06Z"/>
        <path fill={color} d="M352.5,298.68c-1,.06-2,.17-3,.17H214.62c-.21-1.47.88-1.91,1.46-2.62a39,39,0,0,0,9.23-25.4V105.55c0-1.49.08-3,.12-4.48h11c1.2,4.64,2.76,5.79,8.06,5.8q40.38,0,80.75,0c9.09,0,18.18.11,27.28.17q-9.25,20.79-18.49,41.58c-7.18,16.26-14.2,32.59-21.53,48.78a11.87,11.87,0,0,0,0,10.91c5.47,11.71,10.64,23.57,15.86,35.4Q340.47,271.17,352.5,298.68Z"/>
        <path fill={color} d="M196.76,232.85c-8-1.69-16.1-1.33-24.19-1.33H42.84c48.22-64,48.27-127.66-.12-192.25,0-.12.93.28,1.57.28q68.81,0,137.62,0c.49,0,1,.11,1.48.16A16.13,16.13,0,0,0,185.31,42c9.41,7.82,12.26,18.38,12.27,30q.1,78.54,0,157.09C197.59,230.33,198.07,231.8,196.76,232.85Z"/>
        <path fill="#fed06c" d="M22.54,191.73V363.39c0,5.69-1.82,8.48-5.54,8.53s-5.67-2.79-5.67-8.4V19.82c0-5.69,1.81-8.47,5.54-8.52s5.67,2.79,5.67,8.4Z"/>
        <path fill="none" d="M34,222.58V48.69C75.82,92.93,80.84,170.78,34,222.58Z"/>
        <path fill={shadow} d="M196.76,232.85c1.31-1,.83-2.52.83-3.83q0-78.56,0-157.09c0-11.59-2.86-22.15-12.27-30a16.13,16.13,0,0,1-1.92-2.26A27.62,27.62,0,0,1,214,67.43q.18,86.79,0,173.58v2.37C208.87,238.15,203,235.17,196.76,232.85Z"/>
        <path fill={shadow} d="M352.5,298.68q-12.06-27.48-24.14-55C323.14,231.89,318,220,312.5,208.32a11.87,11.87,0,0,1,0-10.91c7.33-16.19,14.35-32.52,21.53-48.78q9.19-20.82,18.49-41.58c4.1-.06,8.22,0,12.32-.22,3-.16,4,.37,2.53,3.61-7.95,17.65-15.71,35.38-23.53,53.09-5.22,11.81-10.36,23.64-15.66,35.41a8.81,8.81,0,0,0,0,7.82q19.45,43.91,38.78,87.87c1.86,4.23,1.85,4.26-2.88,4.23C360.22,298.84,356.36,298.74,352.5,298.68Z"/>
        <path fill={color} d="M193.11,297.77c-14.28,5-31.7-5.6-34.38-21.17-1.8-10.47-.39-21.1-.75-31.66,0-1.16.24-1.93,1.63-1.88,11.16.43,22.37-1,33.5.87a11.52,11.52,0,0,1,4.48,1.69c0,6.08,0,12.15,0,18.23C197.72,275.37,197.05,286.79,193.11,297.77Z"/>
        <path fill={shadow} d="M193.11,297.77c3.94-11,4.61-22.4,4.52-33.92,0-6.08,0-12.15,0-18.23,10.55,4.7,17.47,16.22,16.39,27.32C212.79,285.22,204.49,295.1,193.11,297.77Z"/>
        </svg>      
    </div>
  )
}

export default Flag