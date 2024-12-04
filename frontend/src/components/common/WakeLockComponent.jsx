import React, { useState, useEffect } from 'react';

const WakeLockComponent = () => {
  const [wakeLock, setWakeLock] = useState(null);
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const [status, setStatus] = useState('');
  const [reaquire, setReaquire] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const requestWakeLock = async () => {
    try {
      const newWakeLock = await navigator.wakeLock.request('screen');
      newWakeLock.addEventListener('release', () => {
        setIsWakeLockActive(false);
        setStatus('Wake Lock was released');
      });
      setWakeLock(newWakeLock);
      setIsWakeLockActive(true);
      setStatus('Wake Lock is active');
    } catch (error) {
      setIsWakeLockActive(false);
      setStatus(`${error.name}, ${error.message}`);
      console.error(`${error.name}, ${error.message}`);
    }
  };

  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
      setIsWakeLockActive(false);
      setStatus('Wake Lock was released');
    }
  };

  const handleVisibilityChange = () => {
    if (wakeLock && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  };

  useEffect(() => {
    if (reaquire) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('fullscreenchange', handleVisibilityChange);
    } else {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleVisibilityChange);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleVisibilityChange);
    };
  }, [reaquire, wakeLock]);

  return (
    <div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isWakeLockActive}
            onChange={(e) =>
              e.target.checked ? requestWakeLock() : releaseWakeLock()
            }
          />
          Enable Wake Lock
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={reaquire}
            onChange={(e) => setReaquire(e.target.checked)}
          />
          Reacquire Wake Lock on Visibility/Fullscreen Change
        </label>
      </div>

      <div>
        <button onClick={handleFullScreenToggle}>
          {isFullScreen ? 'Leave Full Screen' : 'Enter Full Screen'}
        </button>
      </div>

      <div>
        <strong>Status:</strong> {status}
      </div>
    </div>
  );
};

export default WakeLockComponent;
