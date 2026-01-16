import { useEffect, useState } from 'react';
import { getGameState, drawCard, finishGame } from '../api/games';
import { GameState, Card } from '../types/game';

const useGame = (gameId: string, userId: string) => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGameState = async () => {
            try {
                const state = await getGameState(gameId);
                setGameState(state);
            } catch (err) {
                setError('Failed to fetch game state');
            } finally {
                setLoading(false);
            }
        };

        fetchGameState();
    }, [gameId]);

    const handleDrawCard = async () => {
        if (gameState && !gameState.finished) {
            try {
                const card: Card = await drawCard(gameId, userId);
                setGameState((prevState) => ({
                    ...prevState,
                    players: {
                        ...prevState.players,
                        [userId]: {
                            ...prevState.players[userId],
                            cards_history: [...prevState.players[userId].cards_history, card],
                        },
                    },
                }));
            } catch (err) {
                setError('Failed to draw card');
            }
        }
    };

    const handleFinishGame = async () => {
        if (gameState) {
            try {
                await finishGame(gameId);
                setGameState((prevState) => ({ ...prevState, finished: true }));
            } catch (err) {
                setError('Failed to finish game');
            }
        }
    };

    return {
        gameState,
        loading,
        error,
        handleDrawCard,
        handleFinishGame,
    };
};

export { useGame };
export default useGame;