import React from 'react';
import { Card } from '../shared/Card';
import { Player } from '../../types/game';

interface DealerHandProps {
  dealerCards: Player['cards_history'];
}

const DealerHand: React.FC<DealerHandProps> = ({ dealerCards }) => {
  return (
    <div className="dealer-hand">
      <h2>Dealer's Hand</h2>
      <div className="cards">
        {dealerCards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default DealerHand;