import React from 'react';
import { Card } from '../shared/Card';
import { Player } from '../../types/game';

interface PlayerHandProps {
  player: Player;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ player }) => {
  return (
    <div className="player-hand">
      <h2>{player.email}'s Hand</h2>
      <div className="cards">
        {player.cards_history.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
      <p>Points: {player.points}</p>
      {player.busted && <p className="busted">Busted!</p>}
    </div>
  );
};

export default PlayerHand;