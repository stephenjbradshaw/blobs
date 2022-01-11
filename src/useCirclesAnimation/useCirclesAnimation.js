import {useRef} from "react";
import {
  detectCollisions,
  moveDrawingPosition,
  paintCircle,
  initialise,
  setVector,
} from "./utils";

/*

 */

const useCirclesAnimation = ({radius, color, numberOfCircles}) => {
  /* Using refs means the values describing the animation persist
   * for the full lifetime of component. This allows the animation
   * to be controlled with 'normal' stateful react code without everything
   * appearing to restart on every re-render caused by a state update.
   */
  const animationRef = useRef({
    previousElapsedTime: 0,
    timeSinceLastStep: 0,
    boxSizeOffset: 2,
    isFirstStep: true,
  });
  const animation = animationRef.current;
  const circlesRef = useRef([
    {
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
      previousDistanceToTravel: null,
    },
  ]);
  const circles = circlesRef.current;

  const step = (canvas, ctx, elapsedTime, speed, synth, isAudioReady) => {
    // Skip the first step, because >1 step is needed to calculate timeSinceLastStep
    if (elapsedTime === 0) return;

    // Keep track of time between steps
    animation.timeSinceLastStep = elapsedTime - animation.previousElapsedTime;

    // Skip this step if the timestamp hasn't changed
    if (animation.timeSinceLastStep === 0) return;

    circles.forEach((circle) => {
      // Calculate how far the circle should move on this step
      const distanceToTravel = (animation.timeSinceLastStep / 1000) * speed;

      if (animation.isFirstStep) {
        initialise(circle, canvas, distanceToTravel);
        animation.isFirstStep = false;
      } else {
        setVector(circle, distanceToTravel);
      }

      detectCollisions(circle, animation, canvas, isAudioReady, synth);

      moveDrawingPosition(circle, animation, canvas);

      paintCircle(ctx, circle);

      circle.previousDistanceToTravel = distanceToTravel;
    });

    animation.previousElapsedTime = elapsedTime;
  };

  return {step};
};

export default useCirclesAnimation;
