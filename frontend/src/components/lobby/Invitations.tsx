import React, { useEffect, useState } from 'react';
import { getInvitations } from '../../api/invitations';
import { Invitation } from '../../types/api';

const Invitations: React.FC = () => {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const data = await getInvitations();
                setInvitations(data);
            } catch (err) {
                setError('Failed to load invitations');
            } finally {
                setLoading(false);
            }
        };

        fetchInvitations();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Game Invitations</h2>
            {invitations.length === 0 ? (
                <p>No invitations available.</p>
            ) : (
                <ul>
                    {invitations.map((invitation) => (
                        <li key={invitation.id}>
                            <p>Game ID: {invitation.gameId}</p>
                            <p>Invited by: {invitation.inviterEmail}</p>
                            <button>Accept</button>
                            <button>Decline</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Invitations;