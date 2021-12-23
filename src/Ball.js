import {getRandomInt} from "./utils";

export class Ball {
  constructor(canvas, radius, color) {
    this.x = getRandomInt(0, canvas.width);
    this.y = getRandomInt(0, canvas.height);
    this.radius = radius;
    this.color = color;
    this.previousElapsedTime = 0;
    this.isFirstDraw = true;
  }
  draw(canvas, ctx, elapsedTime, velocity, synth, controls) {
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
      controls.isAudioReady && synth.triggerAttackRelease("C4", "8n");
    }
    if (this.x + this.dx > canvas.width || this.x + this.dx < 0) {
      this.dx = -this.dx;
      controls.isAudioReady && synth.triggerAttackRelease("D4", "8n");
    }

    this.previousElapsedTime = elapsedTime;
  }
}
