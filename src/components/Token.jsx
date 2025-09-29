import './Token.css';

import React, { useState, useEffect } from "react";

const ProbToken = ({ probability, token, alternative }) => {
    probability = Math.max(0, Math.min(1, probability)); // Clamp to [0, 1]
    const blue = Math.floor(255 * Math.sqrt(probability));
    const red = Math.floor(255 * Math.sqrt(1 - probability));
    
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Shift') {
                setIsShiftPressed(true);
            }
        };
        
        const handleKeyUp = (e) => {
            if (e.key === 'Shift') {
                setIsShiftPressed(false);
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const getTooltipContent = () => {
        if (isShiftPressed) {
            return (
                <div>
                    <div>
                        {token} -&nbsp;
                        <span>
                            {(probability * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div>{alternative}</div>
                </div>
            );
        }
        return alternative;
    };

    return (
        <div className="prob-token" style={{ color: `rgb(${red}, 0, ${blue})`, whiteSpace: 'pre-wrap' }}>
            {alternative && <span className="tooltip-text">{getTooltipContent()}</span>}
            {token}
        </div>
    );
}

export default ProbToken;