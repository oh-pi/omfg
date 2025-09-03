
import React from 'react';
import { QueryClassification } from '../types';

interface BadgeProps {
  classification: QueryClassification;
}

const Badge: React.FC<BadgeProps> = ({ classification }) => {
  const isTrivial = classification === QueryClassification.TRIVIAL;

  const badgeClasses = isTrivial
    ? 'bg-teal-500/80 text-teal-50'
    : 'bg-indigo-500/80 text-indigo-50';

  return (
    <div className={`text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1 ${badgeClasses}`}>
      {classification}
    </div>
  );
};

export default Badge;
