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

    const tick = (currentTimestamp) => {
      // If this is the first frame, store the initial timestamp
      if (timers.initialTimestamp === undefined) {
        timers.initialTimestamp = currentTimestamp;
      }
      // Calculate time since animation started – animation progress will be based on this
      timers.elapsedTime = currentTimestamp - timers.initialTimestamp;

      if (timers.previousTimestamp !== currentTimestamp) {
        renderFrame(canvas, timers.elapsedTime);
      }

      timers.previousTimestamp = currentTimestamp;
      // Step to next frame with recursive call
      requestIdRef.current = window.requestAnimationFrame(tick);
    };

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
