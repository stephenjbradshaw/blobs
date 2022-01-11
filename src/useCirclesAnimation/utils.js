import {getRandomInt, getRandomVector} from "../utils";

// Set random position and direction for first step
export const initialise = (circle, canvas, distanceToTravel) => {
  circle.x = getRandomInt(0, canvas.width);
  circle.y = getRandomInt(0, canvas.height);
  const {dx, dy} = getRandomVector(distanceToTravel);
  circle.dx = dx;
  circle.dy = dy;
};

/* For steps other than first step, scale the delta
 * values based on any change in circle speed.
 * Flip the sign to change direction if a collision was
 * detected on the previous step.
 */
export const setVector = (circle, distanceToTravel) => {
  const scaleFactor = distanceToTravel / circle.previousDistanceToTravel;
  circle.dx = circle.dx * scaleFactor;
  if (circle.isMaxX) {
    circle.dx = -circle.dx;
    circle.isMaxX = false;
  } else if (circle.isMinX) {
    circle.dx = -circle.dx;
    circle.isMinX = false;
  }
  circle.dy = circle.dy * scaleFactor;
  if (circle.isMaxY) {
    circle.dy = -circle.dy;
    circle.isMaxY = false;
  } else if (circle.isMinY) {
    circle.dy = -circle.dy;
    circle.isMinY = false;
  }
};

export const paintCircle = (ctx, circle) => {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = circle.color;
  ctx.fill();
};

/* Check if velocity values on this step would cause circle to exit canvas.
 * If so, set flags so that direction will change on the next step
 * Also, trigger sounds!
 */
export const detectCollisions = (
  circle,
  animation,
  canvas,
  isAudioReady,
  synth
) => {
  /* Allowing the circle to move slightly outside canvas with boxSizeOffset
   * looks more natural
   */
  if (
    circle.x + circle.dx >
    canvas.width - circle.radius + animation.boxSizeOffset
  ) {
    circle.isMaxX = true;
    isAudioReady && synth.triggerAttackRelease("C4", "8n");
  } else if (circle.x + circle.dx < 0 + circle.radius - animation.boxSizeOffset) {
    circle.isMinX = true;
    isAudioReady && synth.triggerAttackRelease("D4", "8n");
  }
  if (
    circle.y + circle.dy >
    canvas.height - circle.radius + animation.boxSizeOffset
  ) {
    circle.isMaxY = true;
    isAudioReady && synth.triggerAttackRelease("E4", "8n");
  } else if (circle.y + circle.dy < 0 + circle.radius - animation.boxSizeOffset) {
    circle.isMinY = true;
    isAudioReady && synth.triggerAttackRelease("F4", "8n");
  }
};

/* Move drawing position based on the circle's delta values.
 * Also, force the circle not to move outside the canvas if
 * a collision has been detected. This is necessary to stop the circle
 * 'escaping' after a pause in animation, e.g when changing tabs.
 */
export const moveDrawingPosition = (circle, animation, canvas) => {
  circle.x += circle.dx;
  circle.y += circle.dy;
  if (circle.isMaxX) {
    circle.x = canvas.width - circle.radius + animation.boxSizeOffset;
  } else if (circle.isMinX) {
    circle.x = 0 + circle.radius - animation.boxSizeOffset;
  }
  if (circle.isMaxY) {
    circle.y = canvas.height - circle.radius + animation.boxSizeOffset;
  } else if (circle.isMinY) {
    circle.y = 0 + circle.radius - animation.boxSizeOffset;
  }
};
