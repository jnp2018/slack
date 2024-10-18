// src/widgets/Whiteboard.jsx
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import ToolBar from './ToolBar';
import { draw, drawPolyline } from '../utils/DrawingUtils';
import './Whiteboard.css';

const socket =
	io('whiteboard-server');

function Whiteboard() {
	const canvasRef = useRef(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [color, setColor] = useState('#000000');
	const [lineWidth, setLineWidth] = useState(2);
	const [lastPos, setLastPos] = useState(null); // Track last drawing position (for free draw)
	const [tool, setTool] = useState('polyline'); // Added tool state, use 'polyline' (free draw) as default

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');

		// Listen for incoming drawing data from other users
		socket.on('drawing', onDrawingEvent);

		// Listen for the shape history from the server when a new user connects
		socket.on('history', (shapes) => {
			shapes.forEach((shape) => {
				draw(context, shape.x0, shape.y0, shape.x1, shape.y1, shape.color, shape.lineWidth);
			});
		});

		// Listen for 'clearCanvas' events from other users
		socket.on('clearCanvas', () => {
			context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas when receiving event
		});

		return () => {
			socket.off('drawing', onDrawingEvent);
			// socket.off('history');
			socket.off('clearCanvas');
		};
	}, []);

	const onDrawingEvent = (shape) => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		if (tool === 'polyline') {
			draw(context, shape.x0, shape.y0, shape.x1, shape.y1, shape.color, shape.lineWidth);
		} else if (shape.tool === 'line') {
			//TODO: drawLine(context, shape.x0, shape.y0, shape.x1, shape.y1, shape.color, shape.lineWidth);
		} else if (shape.tool === 'rectangle') {
			//TODO: drawRectangle(context, shape.x0, shape.y0, shape.x1, shape.y1, shape.color, shape.lineWidth);
		} else if (shape.tool === 'circle') {
			//TODO: drawCircle(context, shape.x0, shape.y0, shape.x1, shape.y1, shape.color, shape.lineWidth);
		}
		console.log(tool);

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

	const handleMouseMove = (e) => {
		if (!isDrawing) return;

		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		if (tool === 'polyline') {
			// draw(context, lastPos?.x || x, lastPos?.y || y, x, y, color, lineWidth);
			drawPolyline(e, canvasRef, isDrawing, color, lineWidth, socket, lastPos, setLastPos);
		} else if (tool === 'line') {
			//TODO: drawLine(context, lastPos?.x || x, lastPos?.y || y, x, y, color, lineWidth);
		} else if (tool === 'rectangle') {
			//TODO: drawRectangle(context, lastPos?.x || x, lastPos?.y || y, x, y, color, lineWidth);
		} else if (tool === 'circle') {
			//TODO: drawCircle(context, lastPos?.x || x, lastPos?.y || y, x, y, color, lineWidth);
		}

		// Emit the drawing data with the tool type
		socket.emit('drawing', {
			x0: lastPos?.x || x,
			y0: lastPos?.y || y,
			x1: x,
			y1: y,
			color: color,
			lineWidth: lineWidth,
			tool: tool  // Send the tool type with the drawing data
		});

		setLastPos({ x, y });
	};

	// Function to clear the canvas
	const clearCanvas = () => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height); // Clear entire canvas

		// Optionally, you can emit this clear action to notify other users
		socket.emit('clearCanvas');
	};

	return (
		<div className="whiteboard-container">
			{/* Pass setTool to ToolBar */}
			<ToolBar
				setColor={setColor}
				setLineWidth={setLineWidth}
				setTool={setTool}
				clearCanvas={clearCanvas}
			/>
			<canvas
				ref={canvasRef}
				width={800}
				height={600}
				onMouseDown={startDrawing}
				onMouseUp={stopDrawing}
				onMouseOut={stopDrawing}
				// onMouseMove={(e) => drawPolyline(e, canvasRef, isDrawing, color, lineWidth, socket, lastPos, setLastPos)}
				onMouseMove={(e) => handleMouseMove(e)}
			/>
		</div>
	);
}

export default Whiteboard;
