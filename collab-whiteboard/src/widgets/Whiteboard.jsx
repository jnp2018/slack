// src/widgets/Whiteboard.jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import ToolBar from './ToolBar';
import { draw, drawPolyline } from '../utils/DrawingUtils';
import './Whiteboard.css';
import { WebSocketContext } from '../WebSocketContext';

function Whiteboard() {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(2);
    const [lastPos, setLastPos] = useState(null); 
    const [tool, setTool] = useState('polyline');

    // Lấy `message` và `sendMessage` từ WebSocketContext
    const { message, sendMessage } = useContext(WebSocketContext);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Kiểm tra nếu có tin nhắn mới
        if (!message) return;
        
        // Chuyển đổi dữ liệu nếu cần
      
		const parseMessage=JSON.parse(message)
		console.log(parseMessage.tag)
        console.log(parseMessage.data)
        // Xử lý các tin nhắn khác nhau dựa vào tag
        if (parseMessage.tag === 'drawing') {
			draw(context, parseMessage.data.x0, parseMessage.data.y0, parseMessage.data.x1, parseMessage.data.y1, parseMessage.data.color, parseMessage.data.lineWidth); // Gọi hàm `draw` để vẽ
		}  else if (parseMessage.tag === 'history') {
            // Lặp qua danh sách shapes và vẽ từng shape lên canvas
			
           parseMessage.data.forEach((drawData) => {
              draw(
				context,
                drawData.x0,
                drawData.y0,
                drawData.x1,
                drawData.y1,
                drawData.color,
                drawData.lineWidth
			  )
		   });

        } else if (parseMessage.tag === 'clearCanvas') {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, [message]);
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
        context.beginPath();
        setIsDrawing(true);
        setLastPos(null);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        setLastPos(null);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (tool === 'polyline') {
            drawPolyline(e, canvasRef, isDrawing, color, lineWidth,sendMessage, lastPos, setLastPos);
        }else if (tool === 'line') {
			//TODO: drawLine(context, lastPos?.x || x, lastPos?.y || y, x, y, color, lineWidth);
		} else if (tool === 'rectangle') {
			//TODO: drawRectangle(context, lastPos?.x || x, lastPos?.y || y, x, y, color, lineWidth);
		} else if (tool === 'circle') {
			//TODO: drawCircle(context, lastPos?.x || x, lastPos?.y || y, x, y, color, lineWidth);
		}

        // Gửi dữ liệu vẽ tới server qua WebSocket
        sendMessage('drawing', {
            x0: lastPos?.x || x,
            y0: lastPos?.y || y,
            x1: x,
            y1: y,
            color: color,
            lineWidth: lineWidth,
            tool: tool
        });

        setLastPos({ x, y });
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Gửi yêu cầu xóa canvas tới server qua WebSocket
        sendMessage('clearCanvas', {});
    };

    return (
        <div className="whiteboard-container">
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
                onMouseMove={handleMouseMove}
            />
        </div>
    );
}

export default Whiteboard;
