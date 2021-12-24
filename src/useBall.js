import {useRef} from "react";
import {getRandomInt} from "./utils";

const useBall = ({radius, color}) => {
  /* Using a ref means these values persist for full lifetime of component.
   * This allows the animation to be controlled with 'normal' stateful react code
   * without the animation appearing to restart on every state update.
   */
  const ballRef = useRef({
    radius,
    color,
    isFirstDraw: true,
    previousElapsedTime: 0,
  });
  const ball = ballRef.current;

  const draw = (canvas, ctx, elapsedTime, velocity, synth, isAudioReady) => {
    // Do nothing on first frame, because we need two frames to work out time since last draw
    if (elapsedTime === 0) return;

    /* Base animation speed on time rather than frames.
     * ball ensures speed stays independent of screen refresh rate, see:
     * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
     */
    ball.timeSinceLastDraw = elapsedTime - ball.previousElapsedTime;

    // Set initial speed and direction. Velocity is in pixels-per-second.
    if (ball.isFirstDraw) {
      ball.x = getRandomInt(0, canvas.width);
      ball.y = getRandomInt(0, canvas.height);
      ball.dx = (ball.timeSinceLastDraw / 1000) * velocity;
      ball.dy = (ball.timeSinceLastDraw / 1000) * velocity;
      ball.isFirstDraw = false;
    }

    // Move the drawing position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Draw
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = ball.color;
    ctx.fill();

    // On collision with edges, flip delta values for the next draw
    if (ball.y + ball.dy > canvas.height || ball.y + ball.dy < 0) {
      ball.dy = -ball.dy;
      isAudioReady && synth.triggerAttackRelease("C4", "8n");
    }
    if (ball.x + ball.dx > canvas.width || ball.x + ball.dx < 0) {
      ball.dx = -ball.dx;
      isAudioReady && synth.triggerAttackRelease("D4", "8n");
    }

    ball.previousElapsedTime = elapsedTime;
  };

  return {draw};
};

export default useBall;
