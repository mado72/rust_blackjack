import React, { useEffect, useState } from 'react';
import { getOpenGames, joinGame } from '../../api/games';
import { Game } from '../../types/game';
import './GameLobby.css';

const GameLobby: React.FC = () => {
    const [openGames, setOpenGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOpenGames = async () => {
            try {
                const games = await getOpenGames();
                setOpenGames(games);
            } catch (err) {
                setError('Failed to fetch open games.');
            } finally {
                setLoading(false);
            }
        };

        fetchOpenGames();
    }, []);

    const handleJoinGame = async (gameId: string) => {
        try {
            await joinGame(gameId);
            // Optionally, redirect to the game page or update state
        } catch (err) {
            setError('Failed to join the game.');
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="game-lobby">
            <h2>Open Games</h2>
            {openGames.length === 0 ? (
                <p>No open games available.</p>
            ) : (
                <ul>
                    {openGames.map((game) => (
                        <li key={game.id}>
                            <span>{game.name}</span>
                            <button onClick={() => handleJoinGame(game.id)}>Join</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GameLobby;