import React, { useEffect, useState } from 'react';
import { getOpenGames } from '../api/games';
import OpenGames from '../components/lobby/OpenGames';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const LobbyPage: React.FC = () => {
    const [openGames, setOpenGames] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOpenGames = async () => {
            try {
                const games = await getOpenGames();
                setOpenGames(games);
            } catch (err) {
                setError('Failed to load open games');
            } finally {
                setLoading(false);
            }
        };

        fetchOpenGames();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Lobby</h1>
            <OpenGames games={openGames} />
        </div>
    );
};

export default LobbyPage;