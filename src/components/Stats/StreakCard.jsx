import React from 'react';

const StreakCard = ({ streak, totalWakeups }) => {
    return (
        <div className="stats-card streak-card">
            <div className="streak-visual">
                <div className="streak-flame">🔥</div>
                <div className="streak-count">{streak}</div>
                <div className="streak-label">일 연속</div>
            </div>
            <div className="streak-info">
                <div className="info-item">
                    <span className="label">총 기상</span>
                    <span className="value">{totalWakeups}일</span>
                </div>
                <div className="info-item">
                    <span className="label">절약한 시간</span>
                    <span className="value">{(totalWakeups * 1.5).toFixed(1)}시간</span>
                </div>
            </div>
            <style>{`
                .stats-card {
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                    margin-bottom: 20px;
                }
                .streak-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%);
                    color: white;
                }
                .streak-visual {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .streak-flame {
                    font-size: 48px;
                    margin-bottom: 8px;
                    animation: pulse 2s infinite;
                }
                .streak-count {
                    font-size: 48px;
                    font-weight: 800;
                    line-height: 1;
                }
                .streak-label {
                    font-size: 14px;
                    opacity: 0.9;
                }
                .streak-info {
                    display: flex;
                    width: 100%;
                    justify-content: space-around;
                    background: rgba(255,255,255,0.2);
                    border-radius: 12px;
                    padding: 12px;
                }
                .info-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .info-item .label {
                    font-size: 12px;
                    opacity: 0.8;
                }
                .info-item .value {
                    font-size: 16px;
                    font-weight: 600;
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default StreakCard;
