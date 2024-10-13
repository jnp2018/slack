// src/widgets/Whiteboard.jsx
import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import ToolBar from './ToolBar';
import './Whiteboard.css';
import { drawLine, draw } from '../utils/DrawingUtils';

const socket = io('http://localhost:4000');

function Whiteboard() {
	const canvasRef = useRef(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [color, setColor] = useState('#000000');
	const [lineWidth, setLineWidth] = useState(2);
	const [lastPos, setLastPos] = useState(null); // Track last drawing position

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');

		// Listen for incoming drawing data from other users
		socket.on('drawing', onDrawingEvent);
		
		// Listen for the shape history from the server when a new user connects
		socket.on('history', (shapes) => {
      shapes.forEach((shape) => {
        drawLine(context, shape.x0, shape.y0, shape.x1, shape.y1, shape.color, shape.lineWidth);
      });
    });

		return () => {
			socket.off('drawing', onDrawingEvent);
			socket.off('history');
		};
	}, []);

	const onDrawingEvent = (data) => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		drawLine(context, data.x0, data.y0, data.x1, data.y1, data.color, data.lineWidth);
	};

	const startDrawing = (e) => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		context.beginPath();  // This resets the path at the start of each new drawing.

		setIsDrawing(true);
		setLastPos(null);  // Reset lastPos when starting a new drawing
	};

	const stopDrawing = () => {
		setIsDrawing(false);
		setLastPos(null);  // Clear lastPos when drawing stops
	};

	return (
		<div className="whiteboard-container">
			<ToolBar setColor={setColor} setLineWidth={setLineWidth} />
			<canvas
				ref={canvasRef}
				width={800}
				height={600}
				onMouseDown={startDrawing}
				onMouseUp={stopDrawing}
				onMouseOut={stopDrawing}
				onMouseMove={(e) => draw(e, canvasRef, isDrawing, color, lineWidth, socket, lastPos, setLastPos)}
			/>
		</div>
	);
}

export default Whiteboard;
