// utils/DrawingUtils.js
export const drawLine = (context, x0, y0, x1, y1, color, lineWidth) => {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.stroke();
  context.closePath();
};

export const draw = (e, canvasRef, isDrawing, color, lineWidth, socket) => {
  if (!isDrawing) return;

  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  context.strokeStyle = color;
  context.lineWidth = lineWidth;
	context.lineCap = 'round';
	
  context.lineTo(x, y);
  context.stroke();
  context.beginPath();
  context.moveTo(x, y);

  socket.emit('drawing', {
    x0: x,
    y0: y,
    x1: x,
    y1: y,
    color: color,
    lineWidth: lineWidth
  });
};
