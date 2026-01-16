import React from 'react';

const GameControls: React.FC<{ onDraw: () => void; onStand: () => void; }> = ({ onDraw, onStand }) => {
    return (
        <div className="game-controls">
            <button onClick={onDraw}>Draw Card</button>
            <button onClick={onStand}>Stand</button>
        </div>
    );
};

export default GameControls;