import React from 'react';

const InsightCard = ({ bestDays, monthlyRate }) => {
    return (
        <div className="stats-card">
            <h3 className="card-title">나의 패턴</h3>
            <div className="insights-row">
                <div className="insight-item">
                    <div className="insight-icon">📅</div>
                    <div className="insight-content">
                        <div className="insight-label">최고의 요일</div>
                        <div className="insight-value">{bestDays.join(', ')}요일</div>
                    </div>
                </div>
                <div className="insight-item">
                    <div className="insight-icon">📈</div>
                    <div className="insight-content">
                        <div className="insight-label">이번 달 성공률</div>
                        <div className="insight-value">{monthlyRate}%</div>
                    </div>
                </div>
            </div>
            <style>{`
                .insights-row {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .insight-item {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    background: #F8F7FC;
                    border-radius: 12px;
                }
                .insight-icon {
                    font-size: 24px;
                    margin-right: 16px;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                .insight-content {
                    flex: 1;
                }
                .insight-label {
                    font-size: 12px;
                    color: #9E9E9E;
                    margin-bottom: 4px;
                }
                .insight-value {
                    font-size: 16px;
                    font-weight: 600;
                    color: #2D2A3E;
                }
            `}</style>
        </div>
    );
};

export default InsightCard;
