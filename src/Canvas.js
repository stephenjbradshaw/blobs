import {useRef, useEffect} from "react";

const Canvas = ({...rest}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let initialTimestamp, elapsedTime;
    let animationFrameId;

    const ball = {
      x: 100,
      y: 100,
      vx: 3,
      vy: 2,
      radius: 15,
      color: "blue",
      draw: function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      },
    };

    const renderFrame = (currentTimestamp) => {
      // If this is the first frame, store the initial timestamp
      if (initialTimestamp === undefined) {
        initialTimestamp = currentTimestamp;
        // Else, calculate time since animation started – animation progress will be based on this
      } else {
        elapsedTime = currentTimestamp - initialTimestamp;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ball.draw();
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy;
      }
      if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx;
      }

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
