import React from 'react';
import ResizablePanels from '../ResizablePanels';
import './Upload.css';

const Upload = () => {
    // Left Panel Content Component
    const LeftPanelContent = () => (
        <>
            <div className="panel-header">
                <h2>Left Panel</h2>
                <p>This is the left side of the split screen</p>
            </div>
            <div className="panel-content">
                <div className="content-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <h3>Left Panel Content</h3>
                    <p>Add your content here. This panel can be resized by dragging the divider.</p>
                </div>
            </div>
        </>
    );

    // Right Panel Content Component
    const RightPanelContent = () => (
        <>
            <div className="panel-header">
                <h2>Right Panel</h2>
                <p>This is the right side of the split screen</p>
            </div>
            <div className="panel-content">
                <div className="content-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <h3>Right Panel Content</h3>
                    <p>Add your content here. This panel can be resized by dragging the divider.</p>
                </div>
            </div>
        </>
    );

    return (
        <ResizablePanels
            leftPanel={<LeftPanelContent />}
            rightPanel={<RightPanelContent />}
            initialLeftWidth={50}
            minLeftWidth={10}
            maxLeftWidth={90}
            className="upload-container"
        />
    );
};

export default Upload;