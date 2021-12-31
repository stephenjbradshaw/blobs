import {useRef, useEffect} from "react";

const Canvas = ({renderFrame, ...rest}) => {
  // Refs used so that these values persist across re-renders
  const canvasRef = useRef(null);
  const timersRef = useRef({
    initialTimestamp: undefined,
    previousTimestamp: undefined,
    elapsedTime: undefined,
  });
  const timers = timersRef.current;
  const requestIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const updateTimers = (currentTimestamp) => {
      /* currentTimestamp is undefined on first tick, and for the
       * first tick after every re-render of the component.
       * Skip setting the timers for these ticks
       */
      if (currentTimestamp === undefined) return;

      // On the second tick, set the initial timestamp
      if (timers.initialTimestamp === undefined)
        timers.initialTimestamp = currentTimestamp;

      /* On the second and subsequent ticks, calculate time since animation started.
       * animation progress will be based on this, ensuring that animation speed
       * stays independent of screen refresh rate, see:
       * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
       */
      timers.elapsedTime = currentTimestamp - timers.initialTimestamp;
    };

    // Main animation loop
    const tick = (currentTimestamp) => {
      updateTimers(currentTimestamp);

      if (timers.previousTimestamp !== currentTimestamp) {
        renderFrame(canvas, timers.elapsedTime);
      }

      timers.previousTimestamp = currentTimestamp;

      // Step to next tick (recursively)
      requestIdRef.current = window.requestAnimationFrame(tick);
    };

    // Start animation
    tick();

    return () => {
      window.cancelAnimationFrame(requestIdRef.current);
    };
  }, [renderFrame, timers]);

  return (
    <canvas ref={canvasRef} {...rest} style={{border: "1px solid black"}}>
      <p>Alt text here</p>
    </canvas>
  );
};

export default Canvas;
