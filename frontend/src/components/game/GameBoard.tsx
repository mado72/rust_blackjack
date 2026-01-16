import React, { useEffect, useState } from 'react';
import { useGame } from '../../hooks/useGame';
import PlayerHand from './PlayerHand';
import DealerHand from './DealerHand';
import GameControls from './GameControls';

const GameBoard: React.FC = () => {
    const { gameState, drawCard, stand, finishGame } = useGame();
    const [isGameFinished, setIsGameFinished] = useState(false);

    useEffect(() => {
        if (gameState.finished) {
            setIsGameFinished(true);
        }
    }, [gameState]);

    const handleDrawCard = () => {
        drawCard();
    };

    const handleStand = () => {
        stand();
    };

    const handleFinishGame = () => {
        finishGame();
    };

    return (
        <div className="game-board">
            <h1>Blackjack Game</h1>
            <DealerHand cards={gameState.dealerHand} />
            <PlayerHand cards={gameState.playerHand} />
            <GameControls
                onDrawCard={handleDrawCard}
                onStand={handleStand}
                onFinishGame={handleFinishGame}
                isGameFinished={isGameFinished}
            />
            {isGameFinished && <div className="game-over">Game Over!</div>}
        </div>
    );
};

export default GameBoard;