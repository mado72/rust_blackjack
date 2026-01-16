import React, { useEffect, useState } from 'react';
import { getOpenGames } from '../../api/games';
import { Game } from '../../types/game';

const OpenGames: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOpenGames = async () => {
            try {
                const response = await getOpenGames();
                setGames(response);
            } catch (err) {
                setError('Failed to fetch open games.');
            } finally {
                setLoading(false);
            }
        };

        fetchOpenGames();
    }, []);

    if (loading) {
        return <div>Loading open games...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Open Games</h2>
            {games.length === 0 ? (
                <p>No open games available.</p>
            ) : (
                <ul>
                    {games.map((game) => (
                        <li key={game.id}>
                            Game ID: {game.id} - Players: {game.players.length}/{game.maxPlayers}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OpenGames;