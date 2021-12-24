import {useRef, useEffect, useState} from "react";
import * as Tone from "tone";
import useBall from "./useBall";

const Canvas = ({...rest}) => {
  const canvasRef = useRef(null);
  // Ref used so that these values persist across re-renders
  const timersRef = useRef({
    initialTimestamp: undefined,
    previousTimestamp: undefined,
    elapsedTime: undefined,
  });

  const timers = timersRef.current;

  const [isAudioReady, setIsAudioReady] = useState(false);

  const {draw} = useBall({radius: 12, color: "blue"});

  const synth = new Tone.PolySynth().toDestination();

  useEffect(() => {
    let animationFrameId;

    // Velocity is in pixels / second
    let velocity = 200;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const renderFrame = (currentTimestamp) => {
      // If this is the first frame, store the initial timestamp
      if (timers.initialTimestamp === undefined) {
        timers.initialTimestamp = currentTimestamp;
      }
      // Calculate time since animation started – animation progress will be based on this
      timers.elapsedTime = currentTimestamp - timers.initialTimestamp;

      if (timers.previousTimestamp !== currentTimestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(canvas, ctx, timers.elapsedTime, velocity, synth, isAudioReady);
      }

      timers.previousTimestamp = currentTimestamp;
      // Step to next frame with recursive call
      animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, isAudioReady, synth, timers]);

  return (
    <>
      <canvas ref={canvasRef} {...rest} style={{border: "1px solid black"}}>
        <p>Alt text here</p>
      </canvas>
      <button
        onClick={async () => {
          await Tone.start();
          setIsAudioReady(true);
        }}
      >
        Start audio
      </button>
    </>
  );
};

export default Canvas;
