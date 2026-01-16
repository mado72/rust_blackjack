import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGameState, drawCard, finishGame } from '../api/games';
import GameBoard from '../components/game/GameBoard';
import GameControls from '../components/game/GameControls';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const GamePage = () => {
    const { gameId } = useParams<{ gameId: string }>();
    const [gameState, setGameState] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGameState = async () => {
            try {
                const state = await getGameState(gameId);
                setGameState(state);
            } catch (err) {
                setError('Failed to load game state');
            } finally {
                setLoading(false);
            }
        };

        fetchGameState();
    }, [gameId]);

    const handleDrawCard = async () => {
        if (gameState && !gameState.finished) {
            try {
                const updatedState = await drawCard(gameId);
                setGameState(updatedState);
            } catch (err) {
                setError('Failed to draw card');
            }
        }
    };

    const handleFinishGame = async () => {
        try {
            const result = await finishGame(gameId);
            setGameState(result);
        } catch (err) {
            setError('Failed to finish game');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Game ID: {gameId}</h1>
            <GameBoard gameState={gameState} />
            <GameControls
                onDrawCard={handleDrawCard}
                onFinishGame={handleFinishGame}
                isFinished={gameState.finished}
            />
        </div>
    );
};

export default GamePage;