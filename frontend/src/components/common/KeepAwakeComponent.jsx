import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../context/GlobalContext';

const KeepAwakeComponent = () => {
  // const [wakeLock, setWakeLock] = useState(null);
  // const [status, setStatus] = useState('');
  const {status, setStatus, wakeLock, setWakeLock} = useContext(GlobalContext);

  // Function to request the wake lock
  const requestWakeLock = async () => {
    try {
      const newWakeLock = await navigator.wakeLock.request('screen');
      newWakeLock.addEventListener('release', () => {
        setStatus("Wake lock was released");
      });

      setStatus("Wake lock is active");
      setWakeLock(newWakeLock);
    } catch (err) {
      setStatus(`Failed to obtain wake lock: ${err.message}`);
    }
  };

  // Function to release the wake lock
  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
      setStatus('Wake Lock was released');
    }
  };

  const handleVisibilityChange = () => {
    if (wakeLock && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  };

  useEffect(() => {
    requestWakeLock();

    return () => {
      releaseWakeLock();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleVisibilityChange);

    return () => {
      // releaseWakeLock();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleVisibilityChange);
    };
  }, [wakeLock]);

  return (
    <>
    </>
  );
};

export default KeepAwakeComponent;