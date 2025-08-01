import React, { useState, useRef, useEffect } from 'react';
import './ResizablePanels.css';

const ResizablePanels = ({ 
    leftPanel, 
    rightPanel, 
    initialLeftWidth = 50,
    minLeftWidth = 10,
    maxLeftWidth = 90,
    className = '',
    containerStyle = {}
}) => {
    const [leftPanelWidth, setLeftPanelWidth] = useState(initialLeftWidth); // Percentage
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);
    const dividerRef = useRef(null);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftPanelWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        
        // Limit the panels to reasonable sizes
        const clampedWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newLeftPanelWidth));
        setLeftPanelWidth(clampedWidth);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging]);

    return (
        <div 
            className={`resizable-panels-container ${className}`} 
            ref={containerRef}
            style={containerStyle}
        >
            {/* Left Panel */}
            <div 
                className="resizable-panel left-panel"
                style={{ width: `${leftPanelWidth}%` }}
            >
                {leftPanel}
            </div>

            {/* Resizable Divider */}
            <div 
                className={`resizable-divider ${isDragging ? 'dragging' : ''}`}
                ref={dividerRef}
                onMouseDown={handleMouseDown}
            >
                <div className="divider-handle">
                    <div className="divider-line"></div>
                    <div className="divider-grip">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="divider-line"></div>
                </div>
            </div>

            {/* Right Panel */}
            <div 
                className="resizable-panel right-panel"
                style={{ width: `${100 - leftPanelWidth}%` }}
            >
                {rightPanel}
            </div>
        </div>
    );
};

export default ResizablePanels; 