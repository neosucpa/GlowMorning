import React from 'react';

const BadgeItem = ({ badge }) => {
    const { name, description, icon, unlocked, percent, current, target, condition } = badge;

    // Determine if we should show progress bar
    // Don't show for simple "1 count" badges if unlocked, or if it's a binary thing?
    // User said: "If difficult to show progress, can remove graph".
    // Let's show it for everything except maybe "First Step" if unlocked?
    // Actually, showing 1/1 is fine.

    // Visual Style
    // Unlocked: Full color, white background, shadow
    // Locked: Grey background, grayscale icon, opacity

    return (
        <div className={`badge-item ${unlocked ? 'unlocked' : 'locked'}`}>
            <div className="badge-icon-container">
                <div className="badge-icon">{icon}</div>
            </div>
            <div className="badge-content">
                <div className="badge-header">
                    <span className="badge-name">{name}</span>
                    {unlocked && <span className="badge-check">✓</span>}
                </div>
                <p className="badge-desc">{description}</p>

                {/* Progress Bar */}
                {!unlocked && target > 1 && (
                    <div className="badge-progress-container">
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>
                        <div className="progress-text">
                            {current} / {target}
                        </div>
                    </div>
                )}
                {/* Special case for target=1 (First Step) */}
                {!unlocked && target === 1 && (
                    <div className="badge-progress-text-only">
                        미획득
                    </div>
                )}
            </div>

            <style>{`
                .badge-item {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    border-radius: 16px;
                    margin-bottom: 12px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                /* Unlocked State */
                .badge-item.unlocked {
                    background: white;
                    box-shadow: 0 4px 12px rgba(139, 127, 220, 0.15);
                    border: 1px solid rgba(139, 127, 220, 0.1);
                }
                .badge-item.unlocked .badge-icon {
                    filter: none;
                    transform: scale(1.1);
                }
                .badge-item.unlocked .badge-name {
                    color: #2D2A3E;
                    font-weight: 700;
                }
                
                /* Locked State */
                .badge-item.locked {
                    background: #F5F5F5;
                    border: 1px solid #EEEEEE;
                    opacity: 0.8;
                }
                .badge-item.locked .badge-icon {
                    filter: grayscale(100%);
                    opacity: 0.5;
                }
                .badge-item.locked .badge-name {
                    color: #9E9E9E;
                }
                .badge-item.locked .badge-desc {
                    color: #BDBDBD;
                }
                
                .badge-icon-container {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: ${unlocked ? '#F8F7FC' : '#E0E0E0'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    flex-shrink: 0;
                }
                .badge-icon {
                    font-size: 28px;
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                
                .badge-content {
                    flex: 1;
                }
                
                .badge-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 4px;
                }
                .badge-check {
                    color: #8B7FDC;
                    font-weight: 900;
                    margin-left: 6px;
                    font-size: 14px;
                }
                
                .badge-desc {
                    font-size: 12px;
                    color: #757575;
                    margin-bottom: 8px;
                    line-height: 1.4;
                }
                
                .badge-progress-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .progress-bar-bg {
                    flex: 1;
                    height: 6px;
                    background: #E0E0E0;
                    border-radius: 3px;
                    overflow: hidden;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: #8B7FDC;
                    border-radius: 3px;
                    transition: width 0.5s ease;
                }
                .progress-text {
                    font-size: 11px;
                    color: #9E9E9E;
                    font-weight: 600;
                    min-width: 30px;
                    text-align: right;
                }
                .badge-progress-text-only {
                    font-size: 11px;
                    color: #9E9E9E;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default BadgeItem;
