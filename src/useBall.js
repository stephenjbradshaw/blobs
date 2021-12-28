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
    // Do nothing on first draw, because we need two frames to work out time since last draw
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
      ball.isFirstDraw = false;
    }

    // Set speed and direction
    ball.dx = (ball.timeSinceLastDraw / 1000) * velocity;
    if (ball.isDxFlipped) ball.dx = -ball.dx;
    ball.dy = (ball.timeSinceLastDraw / 1000) * velocity;
    if (ball.isDyFlipped) ball.dy = -ball.dy;

    /* Check if velocity values would cause ball to exit canvas
     * If so, constrain them so that it stays within canvas,
     * flip the direction for the next draw, and play a sound!
     */
    if (ball.x + ball.dx > canvas.width) {
      ball.dx = canvas.width - ball.x;
      ball.isDxFlipped = true;
      isAudioReady && synth.triggerAttackRelease("C4", "8n");
    } else if (ball.x + ball.dx < 0) {
      ball.dx = 0 - ball.x;
      ball.isDxFlipped = false;
      isAudioReady && synth.triggerAttackRelease("D4", "8n");
    }
    if (ball.y + ball.dy >= canvas.height) {
      ball.dy = canvas.height - ball.y;
      ball.isDyFlipped = true;
      isAudioReady && synth.triggerAttackRelease("E4", "8n");
    } else if (ball.y + ball.dy < 0) {
      ball.dy = 0 - ball.y;
      ball.isDyFlipped = false;
      isAudioReady && synth.triggerAttackRelease("F4", "8n");
    }

    // Move the drawing position to new start points
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Draw
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = ball.color;
    ctx.fill();

    // Set previous elapsed time for `timeSinceLastDraw` calculation
    ball.previousElapsedTime = elapsedTime;
  };

  return {draw};
};

export default useBall;
