import {useRef, useEffect} from "react";
import { Ball } from "./Ball";

const Canvas = ({...rest}) => {
  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

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
        ball1.draw(canvas, ctx, elapsedTime, 200);
        ball2.draw(canvas, ctx, elapsedTime, 100);
      }

      previousTimestamp = currentTimestamp;
      // Step to next frame with recursive call
      animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} {...rest} style={{border: "1px solid black"}}>
      <p>Alt text here</p>
    </canvas>
  );
};

export default Canvas;
