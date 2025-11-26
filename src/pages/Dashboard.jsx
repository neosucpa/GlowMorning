import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import { getTodayStr } from '../utils/dateUtils';
import '../index.css';

const Dashboard = () => {
    const { appState, userData, updateRecord } = useApp();
    const todayStr = getTodayStr();
    const todayRecord = appState.records[todayStr] || {};

    // Chapter Logic
    const chapters = [
        { id: 1, title: "첫 번째 새벽빛", days: 7, emoji: "☀️" },
        { id: 2, title: "빛의 흐름", days: 7, emoji: "🌅" },
        { id: 3, title: "눈부신 도약", days: 7, emoji: "✨" },
        { id: 4, title: "깨어남의 빛", days: 7, emoji: "🌟" },
        { id: 5, title: "찬란한 여정", days: 7, emoji: "💫" },
        { id: 6, title: "황금빛 아침", days: 7, emoji: "🌄" },
        { id: 7, title: "완전한 빛", days: 7, emoji: "🏆" }
    ];

    const currentChapterIdx = Math.min(Math.ceil((appState.totalDays || 1) / 7), 7) - 1;
    const chapter = chapters[currentChapterIdx];
    const chapterDays = (appState.totalDays % 7) || (appState.totalDays > 0 ? 7 : 1);
    const chapterProgress = (chapterDays / 7) * 100;

    // Calendar Logic
    const renderCalendar = () => {
        const year = appState.currentYear;
        const month = appState.currentMonth;
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        const days = [];
        // Empty slots
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }
        // Days
        for (let date = 1; date <= lastDate; date++) {
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
            const isToday = today.getDate() === date && today.getMonth() === month && today.getFullYear() === year;
            const isFuture = new Date(year, month, date) > today;
            const isSuccess = appState.records[dateStr]?.completed;

            let className = 'calendar-day';
            if (isToday) className += ' today';
            if (isFuture) className += ' future';
            if (isSuccess) className += ' success';

            days.push(
                <div key={date} className={className}>
                    {date}
                </div>
            );
        }
        return days;
    };

    // Record Logic
    const handleCheck = (type) => {
        const currentVal = todayRecord[type];
        updateRecord(todayStr, { [type]: !currentVal });
    };

    const handleComplete = () => {
        if (todayRecord.wake || todayRecord.morningNote) {
            updateRecord(todayStr, {
                completed: true,
                completedAt: new Date().toISOString()
            });
            // Show toast (mock)
            alert('✨ 완료! 오늘도 빛나는 아침을 완성했어요!');
        } else {
            alert('💡 최소 하나의 항목을 체크해주세요');
        }
    };

    const location = useLocation(); // Import useLocation
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    useEffect(() => {
        if (location.state?.showWelcome) {
            setShowWelcomeModal(true);
            // Clear state so it doesn't show again on refresh (optional, but good practice)
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    return (
        <div className="dashboard-screen" style={{ paddingBottom: '100px' }}>
            {/* Welcome Modal */}
            {showWelcomeModal && (
                <div className="modal-overlay">
                    <div className="modal fade-in" style={{ textAlign: 'center', padding: '32px 24px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: 'var(--color-text-primary)' }}>
                            환영합니다!
                        </h2>
                        <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
                            빛나는 아침을 위한 첫 걸음을<br />
                            내디디신 것을 축하드려요.<br />
                            <br />
                            당신의 작은 약속이<br />
                            큰 변화를 만들어낼 거예요.
                        </p>
                        <button
                            className="btn-primary"
                            onClick={() => setShowWelcomeModal(false)}
                        >
                            시작하기
                        </button>
                    </div>
                </div>
            )}

            {/* Chapter Header */}
            <div className="chapter-header">
                <div className="chapter-info">
                    <span className="chapter-emoji">{chapter.emoji}</span>
                    <span className="chapter-title">Chapter {chapter.id}: {chapter.title}</span>
                </div>
                <div className="chapter-progress-wrapper">
                    <div className="chapter-progress-bar">
                        <div className="chapter-progress-fill" style={{ width: `${chapterProgress}%` }}></div>
                    </div>
                    <span className="chapter-days">{chapterDays}/7일</span>
                </div>
            </div>

            {/* Calendar Section */}
            <div className="calendar-section">
                <div className="calendar-header">
                    <button className="calendar-nav-btn">◀</button>
                    <span className="calendar-month">{appState.currentYear}년 {appState.currentMonth + 1}월</span>
                    <button className="calendar-nav-btn">▶</button>
                </div>
                <div className="calendar-weekdays">
                    {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                        <div key={d} className="calendar-weekday">{d}</div>
                    ))}
                </div>
                <div className="calendar-days">
                    {renderCalendar()}
                </div>
            </div>

            {/* Stats Section */}
            <div className="stats-section">
                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-value">{appState.currentStreak}일</div>
                    <div className="stat-label">연속성공</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">💫</div>
                    <div className="stat-value">{appState.totalDays}일</div>
                    <div className="stat-label">총달성</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⏰</div>
                    <div className="stat-value">{appState.savedTime}h</div>
                    <div className="stat-label">앞서감</div>
                </div>
            </div>

            {/* Today's Record */}
            <div className="record-card">
                <div className="record-header">
                    <span className="record-date-icon">📅</span>
                    <span className="record-date-text">
                        {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                    </span>
                </div>

                {!todayRecord.completed ? (
                    <>
                        <div className="record-checklist">
                            <div className="checklist-item" onClick={() => handleCheck('wake')}>
                                <div className={`checkbox ${todayRecord.wake ? 'checked' : ''}`}></div>
                                <div className="checklist-text">{userData.targetWakeTime} 정시 기상</div>
                            </div>
                            <div className="checklist-item" onClick={() => handleCheck('morningNote')}>
                                <div className={`checkbox ${todayRecord.morningNote ? 'checked' : ''}`}></div>
                                <div className="checklist-text">{userData.morningTheme?.emoji} {userData.morningTheme?.name} 작성</div>
                            </div>
                        </div>
                        <button
                            className="btn-complete"
                            disabled={!todayRecord.wake && !todayRecord.morningNote}
                            onClick={handleComplete}
                        >
                            기록 완료 ✨
                        </button>
                    </>
                ) : (
                    <div className="btn-complete" style={{ background: '#E8E4F3', color: 'var(--color-primary)', cursor: 'default', boxShadow: 'none' }}>
                        기록 완료됨 ✨
                    </div>
                )}
            </div>

            <BottomNav />

            <style>{`
                .chapter-header {
                    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
                    padding: 24px; color: white; border-radius: 0 0 24px 24px;
                }
                .chapter-info { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
                .chapter-emoji { font-size: 24px; }
                .chapter-title { font-size: 18px; font-weight: 600; }
                .chapter-progress-wrapper { display: flex; align-items: center; gap: 12px; }
                .chapter-progress-bar { flex: 1; height: 8px; background: rgba(255, 255, 255, 0.3); border-radius: 4px; overflow: hidden; }
                .chapter-progress-fill { height: 100%; background: white; border-radius: 4px; transition: width 500ms ease; }
                .chapter-days { font-size: 14px; font-weight: 600; white-space: nowrap; }
                
                .calendar-section { background: white; margin: 16px; padding: 20px; border-radius: 20px; box-shadow: var(--shadow-card); }
                .calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .calendar-nav-btn { width: 36px; height: 36px; border: none; background: #F8F7FC; border-radius: 8px; cursor: pointer; }
                .calendar-month { font-size: 18px; font-weight: 700; color: var(--color-text-primary); }
                .calendar-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-bottom: 12px; }
                .calendar-weekday { text-align: center; font-size: 12px; font-weight: 600; color: var(--color-text-secondary); }
                .calendar-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
                .calendar-day { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 12px; font-size: 14px; font-weight: 500; color: var(--color-text-primary); position: relative; }
                .calendar-day.today { border: 2px solid var(--color-primary); font-weight: 700; }
                .calendar-day.success { background: var(--color-primary); color: white; font-weight: 700; }
                .calendar-day.success::after { content: '☀️'; position: absolute; bottom: 2px; font-size: 10px; }
                .calendar-day.future { opacity: 0.3; }
                
                .stats-section { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 0 16px; margin-bottom: 16px; }
                .stat-card { background: white; border-radius: 16px; padding: 20px 12px; text-align: center; box-shadow: var(--shadow-card); }
                .stat-icon { font-size: 28px; margin-bottom: 8px; }
                .stat-value { font-size: 20px; font-weight: 700; color: var(--color-primary); margin-bottom: 4px; }
                .stat-label { font-size: 11px; font-weight: 500; color: var(--color-text-secondary); }
                
                .record-card { background: white; margin: 0 16px 100px; padding: 24px; border-radius: 20px; box-shadow: var(--shadow-card); }
                .record-header { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
                .record-date-icon { font-size: 20px; }
                .record-date-text { font-size: 16px; font-weight: 600; color: var(--color-text-primary); }
                .record-checklist { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }
                .checklist-item { display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 12px; cursor: pointer; transition: all 300ms ease; }
                .checklist-item:hover { background: #F8F7FC; }
                .checkbox { width: 28px; height: 28px; border: 2px solid var(--color-primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .checkbox.checked { background: var(--color-primary); border-color: var(--color-primary); }
                .checkbox.checked::after { content: '✓'; color: white; font-size: 16px; font-weight: 700; }
                .checklist-text { font-size: 15px; font-weight: 500; color: var(--color-text-primary); }
                .btn-complete { width: 100%; height: 52px; background: var(--color-primary); color: white; border: none; border-radius: 16px; font-size: 16px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(139, 127, 220, 0.3); }
                .btn-complete:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
            `}</style>
        </div>
    );
};

export default Dashboard;
