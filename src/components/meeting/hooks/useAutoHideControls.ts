import { useEffect, useRef, useState, useCallback } from "react";

export function useAutoHideControls(timeout = 3000) {
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const isInteracting = useRef(false);

  const hideControls = useCallback(() => {
    if (!isInteracting.current) setShowControls(false);
  }, []);

  const resetTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    if (!isInteracting.current)
      controlsTimeout.current = setTimeout(hideControls, timeout);
  }, [hideControls, timeout]);

  useEffect(() => {
    const handleActivity = () => resetTimer();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    window.addEventListener("keydown", handleActivity);
    resetTimer();
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [resetTimer]);

  const handleInteraction = (active: boolean) => {
    isInteracting.current = active;
    if (active) {
      setShowControls(true);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    } else {
      resetTimer();
    }
  };

  return { showControls, handleInteraction };
}
