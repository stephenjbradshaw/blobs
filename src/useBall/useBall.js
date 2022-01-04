import {useRef} from "react";
import {
  detectCollisions,
  moveDrawingPosition,
  paintBall,
  initialise,
  setVector,
} from "./utils";

const useBall = ({radius, color}) => {
  /* Using a ref means the values describing the ball persist
   * for the full lifetime of component. This allows the animation
   * to be controlled with 'normal' stateful react code without the
   * animation appearing to restart on every re-render caused by a state update.
   */
  const ballRef = useRef({
    x: null,
    y: null,
    dx: null,
    dy: null,
    isMaxX: false,
    isMinX: false,
    isMaxY: false,
    isMinY: false,
    radius,
    color,
    isFirstStep: true,
    previousElapsedTime: 0,
    timeSinceLastStep: 0,
    previousDistanceToTravel: null,
    boxSizeOffset: 2,
  });
  const ball = ballRef.current;

  const step = (canvas, ctx, elapsedTime, speed, synth, isAudioReady) => {
    // Skip the first step, because >1 step is needed to calculate timeSinceLastStep
    if (elapsedTime === 0) return;

    // Keep track of time between steps
    ball.timeSinceLastStep = elapsedTime - ball.previousElapsedTime;

    // Skip this step if the timestamp hasn't changed
    if (ball.timeSinceLastStep === 0) return;

    // Calculate how far the ball should move on this step
    const distanceToTravel = (ball.timeSinceLastStep / 1000) * speed;

    if (ball.isFirstStep) {
      initialise(ball, canvas, distanceToTravel);
      ball.isFirstStep = false;
    } else {
      setVector(ball, distanceToTravel);
    }

    detectCollisions(ball, canvas, isAudioReady, synth);

    moveDrawingPosition(ball, canvas);

    paintBall(ctx, ball);

    ball.previousElapsedTime = elapsedTime;
    ball.previousDistanceToTravel = distanceToTravel;
  };

  return {step};
};

export default useBall;
