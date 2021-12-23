import {useRef, useEffect} from "react";
import {Ball} from "./Ball";
import * as Tone from "tone";

const Canvas = ({...rest}) => {
  const canvasRef = useRef(null);
  // Store control states in ref, as we don't want changes to cause rerender
  const controlsRef = useRef({isAudioReady: false});
  const controls = controlsRef.current;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const synth = new Tone.PolySynth().toDestination();

    const ball1 = new Ball(canvas, 12, "blue");
    const ball2 = new Ball(canvas, 12, "red");

    let initialTimestamp, previousTimestamp, elapsedTime, animationFrameId;

    const renderFrame = (currentTimestamp) => {
      // If this is the first frame, store the initial timestamp
      if (initialTimestamp === undefined) {
        initialTimestamp = currentTimestamp;
      }
      // Calculate time since animation started – animation progress will be based on this
      elapsedTime = currentTimestamp - initialTimestamp;

      if (previousTimestamp !== currentTimestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ball1.draw(canvas, ctx, elapsedTime, 200, synth, controls);
        ball2.draw(canvas, ctx, elapsedTime, 100, synth, controls);
      }

      previousTimestamp = currentTimestamp;
      // Step to next frame with recursive call
      animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [controls]);

  return (
    <>
      <canvas ref={canvasRef} {...rest} style={{border: "1px solid black"}}>
        <p>Alt text here</p>
      </canvas>
      <button
        onClick={async () => {
          await Tone.start();
          controls.isAudioReady = true;
        }}
      >
        Start audio
      </button>
    </>
  );
};

export default Canvas;
