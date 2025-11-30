import React from 'react';
import '../index.css';

const FeedView = ({ records, userData, onEdit }) => {
    // Sort records by date descending
    const sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedRecords.length === 0) {
        return (
            <div className="empty-feed">
                <div className="empty-icon">📭</div>
                <p>아직 기록이 없어요.<br />매일 아침을 기록해보세요!</p>
            </div>
        );
    }

    return (
        <div className="feed-view">
            {sortedRecords.map((record, index) => (
                <FeedCard key={record.date} record={record} userData={userData} onEdit={onEdit} />
            ))}
            <style>{`
                .feed-view {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    padding-bottom: 40px;
                }
                .empty-feed {
                    text-align: center;
                    padding: 40px 0;
                    color: #9E9E9E;
                }
                .empty-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                }
            `}</style>
        </div>
    );
};

const FeedCard = ({ record, userData, onEdit }) => {
    const dateObj = new Date(record.date);
    const dateNum = dateObj.getDate();

    // Format Wake-up Time
    let wakeTimeStr = "";
    if (record.wakeTime) {
        const wakeDate = new Date(record.wakeTime);
        wakeTimeStr = wakeDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    // Determine Success Color
    // Default to purple (success), orange (partial), grey (fail)
    // Logic: if wake && completed -> success (purple)
    //        if wake -> partial (orange)
    //        else -> fail (grey)
    let statusColor = '#8B7FDC'; // Default Success
    if (record.wake && !record.completed) {
        statusColor = '#FF9800'; // Partial
    } else if (!record.wake) {
        statusColor = '#BDBDBD'; // Fail
    }

    return (
        <div className="feed-card">
            {/* Header */}
            <div className="feed-header">
                <div className="header-left">
                    <div className="date-badge" style={{ background: statusColor }}>
                        {dateNum}
                    </div>
                    <div className="wake-time-display">
                        <span className="wake-label">기상시간</span>
                        <span className="wake-value">{wakeTimeStr || "--:--"}</span>
                    </div>
                </div>
                <div className="more-options" onClick={() => onEdit && onEdit(record)}>•••</div>
            </div>

            {/* Image Area */}
            <div className="feed-image-container">
                {record.photoUrl ? (
                    <img src={record.photoUrl} alt="Morning Record" className="feed-image" />
                ) : (
                    <div className="feed-image-placeholder" style={{ background: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)' }}>
                        <div className="placeholder-content">
                            <span className="placeholder-emoji">✨</span>
                            <span className="placeholder-text">{record.morningNote || "오늘의 아침"}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content (Footer) - Text Only */}
            <div className="feed-content">
                <div className="caption-text">{record.morningNote || "상쾌한 아침 시작! ☀️"}</div>
            </div>

            <style>{`
                .feed-card {
                    background: white;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
                }
                .feed-header {
                    padding: 12px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .date-badge {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 16px;
                }
                .wake-time-display {
                    display: flex;
                    align-items: baseline;
                    gap: 6px;
                }
                .wake-label {
                    font-size: 13px;
                    color: #9E9E9E;
                    font-weight: 500;
                    text-decoration: line-through; /* Strikethrough effect as per image style hint if desired, but image showed 'Hoho' crossed out. User said 'Modify as indicated'. The arrow points to 'Wake time 05:30'. Let's keep it clean. */
                    text-decoration: none; 
                }
                .wake-value {
                    font-size: 18px;
                    font-weight: 700;
                    color: #FF5757; /* Red color as shown in image annotation */
                }
                .more-options {
                    color: #9E9E9E;
                    cursor: pointer;
                }

                .feed-image-container {
                    width: 100%;
                    aspect-ratio: 1;
                    background: #F5F5F5;
                    overflow: hidden;
                }
                .feed-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .feed-image-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .placeholder-content {
                    text-align: center;
                    color: white;
                    padding: 20px;
                }
                .placeholder-emoji { font-size: 48px; display: block; margin-bottom: 12px; }
                .placeholder-text { font-size: 18px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }

                .feed-content {
                    padding: 16px;
                }
                .caption-text {
                    font-size: 14px;
                    line-height: 1.6;
                    color: #424242;
                }
            `}</style>
        </div>
    );
};

export default FeedView;
