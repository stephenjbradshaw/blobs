import {getRandomInt, getRandomVector} from "../utils";

// Set random position and direction for first step
export const initialise = (ball, canvas, distanceToTravel) => {
  ball.x = getRandomInt(0, canvas.width);
  ball.y = getRandomInt(0, canvas.height);
  const {dx, dy} = getRandomVector(distanceToTravel);
  ball.dx = dx;
  ball.dy = dy;
};

/* For steps other than first step, scale the delta
 * values based on any change in ball speed.
 * Flip the sign to change direction if a collision was
 * detected on the previous step.
 */
export const setVector = (ball, distanceToTravel) => {
  const scaleFactor = distanceToTravel / ball.previousDistanceToTravel;
  ball.dx = ball.dx * scaleFactor;
  if (ball.isMaxX) {
    ball.dx = -ball.dx;
    ball.isMaxX = false;
  } else if (ball.isMinX) {
    ball.dx = -ball.dx;
    ball.isMinX = false;
  }
  ball.dy = ball.dy * scaleFactor;
  if (ball.isMaxY) {
    ball.dy = -ball.dy;
    ball.isMaxY = false;
  } else if (ball.isMinY) {
    ball.dy = -ball.dy;
    ball.isMinY = false;
  }
};

export const paintBall = (ctx, ball) => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = ball.color;
  ctx.fill();
};

/* Check if velocity values on this step would cause ball to exit canvas.
 * If so, set flags so that direction will change on the next step
 * Also, trigger sounds!
 */
export const detectCollisions = (ball, canvas, isAudioReady, synth) => {
  /* Allowing the ball to move slightly outside canvas with boxSizeOffset
   * looks more natural
   */
  if (ball.x + ball.dx > canvas.width - ball.radius + ball.boxSizeOffset) {
    ball.isMaxX = true;
    isAudioReady && synth.triggerAttackRelease("C4", "8n");
  } else if (ball.x + ball.dx < 0 + ball.radius - ball.boxSizeOffset) {
    ball.isMinX = true;
    isAudioReady && synth.triggerAttackRelease("D4", "8n");
  }
  if (ball.y + ball.dy > canvas.height - ball.radius + ball.boxSizeOffset) {
    ball.isMaxY = true;
    isAudioReady && synth.triggerAttackRelease("E4", "8n");
  } else if (ball.y + ball.dy < 0 + ball.radius - ball.boxSizeOffset) {
    ball.isMinY = true;
    isAudioReady && synth.triggerAttackRelease("F4", "8n");
  }
};

/* Move drawing position based on the ball's delta values.
 * Also, force the ball not to move outside the canvas if
 * a collision has been detected. This is necessary to stop the ball
 * 'escaping' after a pause in animation, e.g when changing tabs.
 */
export const moveDrawingPosition = (ball, canvas) => {
  ball.x += ball.dx;
  ball.y += ball.dy;
  if (ball.isMaxX) {
    ball.x = canvas.width - ball.radius + ball.boxSizeOffset;
  } else if (ball.isMinX) {
    ball.x = 0 + ball.radius - ball.boxSizeOffset;
  }
  if (ball.isMaxY) {
    ball.y = canvas.height - ball.radius + ball.boxSizeOffset;
  } else if (ball.isMinY) {
    ball.y = 0 + ball.radius - ball.boxSizeOffset;
  }
};
