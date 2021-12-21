import {useRef, useEffect} from "react";

const Canvas = ({...rest}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let initialTimestamp, elapsedTime;
    let animationFrameId;

    class Ball {
      constructor(x, y, vx, vy, radius, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
      }
      draw(canvas, ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.vy > canvas.height || this.y + this.vy < 0) {
          this.vy = -this.vy;
        }
        if (this.x + this.vx > canvas.width || this.x + this.vx < 0) {
          this.vx = -this.vx;
        }
      }
    }

    const ball1 = new Ball(100, 100, 3, 2, 15, "blue");
    const ball2 = new Ball(100, 100, 5, 3, 15, "red");

    const renderFrame = (currentTimestamp) => {
      // If this is the first frame, store the initial timestamp
      if (initialTimestamp === undefined) {
        initialTimestamp = currentTimestamp;
        // Else, calculate time since animation started – animation progress will be based on this
      } else {
        elapsedTime = currentTimestamp - initialTimestamp;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ball1.draw(canvas, ctx);
      ball2.draw(canvas, ctx);

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
