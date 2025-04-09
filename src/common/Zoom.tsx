"use client"
import React, { useState } from 'react';

interface ZoomProps {
    children: React.ReactNode;
}

const Zoom: React.FC<ZoomProps> = ({ children }) => {
    const [fontSize, setFontSize] = useState<number>(16); // Default font size

    const increaseFontSize = () => {
        setFontSize((prevSize) => prevSize + 2); // Increase font size by 2
    };

    const decreaseFontSize = () => {
        setFontSize((prevSize) => Math.max(prevSize - 2, 10)); // Decrease font size by 2 but not below 10
    };

    return (
        <div style={{ fontSize: `${fontSize}px` }}>
            <div>
                <button onClick={increaseFontSize}>+ A</button>
                <button onClick={decreaseFontSize}>- A</button>
            </div>
            <div>{children}</div>
        </div>
    );
};

export default Zoom;