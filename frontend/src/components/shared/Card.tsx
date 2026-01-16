import React from 'react';

interface CardProps {
  suit: string;
  rank: string;
}

const Card: React.FC<CardProps> = ({ suit, rank }) => {
  return (
    <div className="card">
      <div className="card-rank">{rank}</div>
      <div className="card-suit">{suit}</div>
    </div>
  );
};

export default Card;