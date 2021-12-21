import {useRef, useEffect} from "react";

const Canvas = ({...rest}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let initialTimestamp, elapsedTime;
    let animationFrameId;

    const renderFrame = (currentTimestamp) => {
      // If this is the first frame, store the initial timestamp
      if (initialTimestamp === undefined) {
        initialTimestamp = currentTimestamp;
        // Else, calculate time since animation started – animation progress will be based on this
      } else {
        elapsedTime = currentTimestamp - initialTimestamp;
      }

      // Circle params
      const x = 50;
      const y = 100;
      const radius = 20 * Math.sin(elapsedTime * 0.001) ** 2;
      const startAngle = 0;
      const endAngle = 2 * Math.PI;

      // Draw
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle);
      ctx.fill();

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
