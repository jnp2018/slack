// src/components/ToolBar.js
import React from 'react';
import './ToolBar.css';

function ToolBar({ setColor, setLineWidth }) {
  return (
    <div className="toolbar">
      <input 
        type="color" 
        onChange={(e) => setColor(e.target.value)} 
        defaultValue="#000000"
      />
      <input 
        type="range" 
        min="1" 
        max="20" 
        defaultValue="2" 
        onChange={(e) => setLineWidth(parseInt(e.target.value))} 
      />
    </div>
  );
}

export default ToolBar;