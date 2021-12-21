import {useRef, useEffect, useCallback} from "react";

const Canvas = ({...rest}) => {
  const canvasRef = useRef(null);

  const draw = useCallback((ctx, frameCount) => {
    const x = 50;
    const y = 100;
    const radius = 20 * Math.sin(frameCount * 0.01) ** 2;
    const startAngle = 0;
    const endAngle = 2 * Math.PI;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.fill();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let frameCount = 0;
    let animationFrameId;

    const render = () => {
      frameCount++;
      draw(ctx, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    draw(ctx);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return (
    <canvas ref={canvasRef} {...rest} style={{border: "1px solid black"}}>
      <p>Alt text here</p>
    </canvas>
  );
};

export default Canvas;
