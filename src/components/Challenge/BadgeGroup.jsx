import React from 'react';
import BadgeItem from './BadgeItem';

const BadgeGroup = ({ title, badges }) => {
    // Sort badges: Unlocked first? Or Tier order?
    // User request: "Easy items (Tier 1) at the top".
    // So sort by tier.
    const sortedBadges = [...badges].sort((a, b) => a.tier - b.tier);

    return (
        <div className="badge-group">
            <h3 className="group-title">{title}</h3>
            <div className="group-list">
                {sortedBadges.map(badge => (
                    <BadgeItem key={badge.id} badge={badge} />
                ))}
            </div>
            <style>{`
                .badge-group {
                    margin-bottom: 32px;
                }
                .group-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #2D2A3E;
                    margin-bottom: 16px;
                    padding-left: 4px;
                }
                .group-list {
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
        </div>
    );
};

export default BadgeGroup;
