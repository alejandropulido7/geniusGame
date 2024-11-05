import React, { useEffect } from 'react';

const KeepAwakeComponent = () => {
  let wakeLock = null;

  // Function to request the wake lock
  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log("Wake lock is active");

      // Listen for wake lock release (e.g., if the device is low on battery)
      wakeLock.addEventListener('release', () => {
        console.log("Wake lock was released");
      });
    } catch (err) {
      console.error(`Failed to obtain wake lock: ${err.message}`);
    }
  };

  // Function to release the wake lock
  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release();
      wakeLock = null;
    }
  };

  useEffect(() => {
    // Request wake lock when component mounts
    requestWakeLock();

    // Set up a listener to reapply wake lock on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !wakeLock) {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up when component unmounts
    return () => {
      releaseWakeLock();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
    </>
  );
};

export default KeepAwakeComponent;