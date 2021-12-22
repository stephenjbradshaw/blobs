import {useRef, useEffect} from "react";

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const Canvas = ({...rest}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    class Ball {
      constructor(canvas, radius, color) {
        this.x = getRandomInt(0, canvas.width);
        this.y = getRandomInt(0, canvas.height);
        this.radius = radius;
        this.color = color;
        this.previousElapsedTime = 0;
        this.isFirstDraw = true;
      }
      draw(canvas, ctx, elapsedTime, velocity) {
        // Do nothing on first frame, because we need two frames to work out time since last draw
        if (elapsedTime === 0) return;

        /* Base animation speed on time rather than frames.
         * This ensures speed stays independent of screen refresh rate, see:
         * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
         */
        this.timeSinceLastDraw = elapsedTime - this.previousElapsedTime;

        // Set initial speed and direction. Velocity is in pixels-per-second.
        if (this.isFirstDraw) {
          this.dx = (this.timeSinceLastDraw / 1000) * velocity;
          this.dy = (this.timeSinceLastDraw / 1000) * velocity;
          this.isFirstDraw = false;
        }

        // Move the drawing position
        this.x += this.dx;
        this.y += this.dy;

        // Draw
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        // On collision with edges, flip delta values for the next draw
        if (this.y + this.dy > canvas.height || this.y + this.dy < 0) {
          this.dy = -this.dy;
        }
        if (this.x + this.dx > canvas.width || this.x + this.dx < 0) {
          this.dx = -this.dx;
        }

        this.previousElapsedTime = elapsedTime;
      }
    }

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
