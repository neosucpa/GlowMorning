import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import { getTodayStr } from '../utils/dateUtils';
import { getChapterInfo } from '../constants/chapters';
import TimePicker24h from '../components/TimePicker24h';
import MorningLogModal from '../components/MorningLogModal';
import '../index.css';

const Dashboard = () => {
    const { appState, userData, updateRecord } = useApp();
    const todayStr = getTodayStr();
    const todayRecord = appState.records[todayStr] || {};

    // State for selected date (for viewing past records)
    const [selectedDate, setSelectedDate] = useState(new Date());
    // State for the start of the currently visible week
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const now = new Date();
        const day = now.getDay(); // 0 (Sun) - 6 (Sat)
        const start = new Date(now);
        start.setDate(now.getDate() - day); // Move to Sunday
        start.setHours(0, 0, 0, 0);
        return start;
    });

    // Chapter Logic
    const { chapter, progress, dayInChapter } = getChapterInfo(appState.totalDays || 0);

    // Get dates for the current week
    const getCurrentWeekDates = () => {
        const dates = [];
        const start = new Date(currentWeekStart);
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const weekDates = getCurrentWeekDates();

    // Navigation Handlers
    const handlePrevWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() - 7);
        setCurrentWeekStart(newStart);
    };

    const handleNextWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() + 7);
        setCurrentWeekStart(newStart);
    };

    // Helper functions
    const isSameDate = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const isToday = (date) => isSameDate(date, new Date());
    const isSelected = (date) => isSameDate(date, selectedDate);
    const isFuture = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(date);
        target.setHours(0, 0, 0, 0);
        return target > today;
    };

    // Get status for a date
    const getDateStatus = (date) => {
        const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const record = appState.records[dateStr];

        if (isFuture(date)) return 'none';
        if (!record) return 'none'; // Or 'failed' if past? User said "fail | none". Let's assume none for no record yet.

        // Perfect: wake + morningNote both true (or completed)
        if (record.completed || (record.wake && record.morningNote)) {
            return 'perfect'; // success
        }
        // Partial: only wake
        if (record.wake) {
            return 'partial'; // success (partial)
        }
        // Failed (if record exists but no wake?)
        return 'failed';
    };

    const handleDateClick = (date) => {
        // Allow clicking future dates to see empty state, but actions will be disabled
        setSelectedDate(date);
    };

    // Get selected date's record
    const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const selectedRecord = appState.records[selectedDateStr] || {};
    const isSelectedFuture = isFuture(selectedDate);

    const location = useLocation();
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    useEffect(() => {
        if (location.state?.showWelcome) {
            setShowWelcomeModal(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // Calculate header month (based on the first day of the week, or majority? Usually first day or current selected)
    // User said: "주간 이동 시 월이 바뀌면 상단 YYYY년 MM월 텍스트 자동 갱신"
    // Let's use the month of the currentWeekStart
    const headerYear = currentWeekStart.getFullYear();
    const headerMonth = currentWeekStart.getMonth() + 1;

    return (
        <div className="dashboard-screen">
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
                            내디디신 것을 축하드려요.
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
                <div className="chapter-top-row">
                    <span className="chapter-emoji">{chapter.emoji}</span>
                    <span className="chapter-title">Chapter {chapter.id}: {chapter.title}</span>
                </div>
                <div className="chapter-progress-row">
                    <div className="chapter-progress-bar">
                        <div className="chapter-progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="chapter-days-text">{dayInChapter}/{chapter.duration}일</span>
                </div>
            </div>

            {/* Calendar Section - Weekly Strip with Navigation */}
            <div className="calendar-section">
                <div className="calendar-header-row">
                    <button className="nav-btn" onClick={handlePrevWeek}>‹</button>
                    <div className="calendar-month-header">
                        {headerYear}. {headerMonth}.
                    </div>
                    <button className="nav-btn" onClick={handleNextWeek}>›</button>
                </div>

                <div className="calendar-dates-grid">
                    {weekDates.map((date, index) => {
                        const status = getDateStatus(date);
                        const weekdayShort = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
                        const isDateToday = isToday(date);
                        const isDateSelected = isSelected(date);
                        const isDateFuture = isFuture(date);

                        return (
                            <div
                                key={index}
                                className={`calendar-date ${isDateToday ? 'today' : ''} ${isDateSelected ? 'selected' : ''} ${isDateFuture ? 'future' : ''}`}
                                onClick={() => handleDateClick(date)}
                            >
                                <div className="date-weekday" style={{ color: date.getDay() === 0 ? '#FF5757' : date.getDay() === 6 ? '#5C6BC0' : '#999' }}>
                                    {weekdayShort}
                                </div>
                                <div className="date-number">{date.getDate()}</div>
                                {status !== 'none' && (
                                    <div className={`date-dot ${status}`}></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="content-scroll-area">
                <h3 className="section-title">
                    {isToday(selectedDate) ? "오늘의 아침" : `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일의 아침`}
                </h3>

                {/* Wake Up Card Logic */}
                <WakeUpCard
                    selectedDate={selectedDate}
                    selectedRecord={selectedRecord}
                    targetTime={userData.targetWakeTime}
                    updateRecord={updateRecord}
                    todayStr={todayStr}
                />


                {/* Morning Log Card */}
                <MorningLogCard
                    selectedDate={selectedDate}
                    selectedRecord={selectedRecord}
                    updateRecord={updateRecord}
                    todayStr={todayStr}
                    morningTheme={userData.morningTheme}
                />

                {/* Stats Section */}
                <h3 className="section-title">나의 기록</h3>
                <div className="stats-row">
                    <div className="stat-item">
                        <div className="stat-value-row">
                            <span className="stat-num">{appState.currentStreak}</span>
                            <span className="stat-unit">일</span>
                        </div>
                        <div className="stat-label">연속 성공</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value-row">
                            <span className="stat-num">{appState.totalDays}</span>
                            <span className="stat-unit">일</span>
                        </div>
                        <div className="stat-label">총 달성</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value-row">
                            <span className="stat-num">{appState.savedTime}</span>
                            <span className="stat-unit">시간</span>
                        </div>
                        <div className="stat-label">앞서간 시간</div>
                    </div>
                </div>
            </div>

            <BottomNav />

            <style>{`
                .dashboard-screen {
                    background-color: #F8F7FC;
                    min-height: 100vh;
                    padding-bottom: 100px;
                }

                /* Chapter Header */
                .chapter-header {
                    background: #8B7FDC; /* Solid purple as per image */
                    padding: 16px 30px 20px;
                    border-radius: 0 0 24px 24px;
                    color: white;
                }
                .chapter-top-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                    justify-content: center;
                }
                .chapter-emoji { font-size: 24px; }
                .chapter-title { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
                
                .chapter-progress-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .chapter-progress-bar {
                    flex: 1;
                    height: 5px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                    overflow: hidden;
                }
                .chapter-progress-fill {
                    height: 100%;
                    background: white;
                    border-radius: 10px;
                }
                .chapter-days-text {
                    font-size: 14px;
                    font-weight: 500;
                }

                /* Calendar Section */
                /* Calendar Section */
                .calendar-section {
                    background: white;
                    margin: 0;
                    padding: 16px 0 14px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.03);
                }
                .calendar-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 30px;
                    margin-bottom: 12px;
                }
                .calendar-month-header {
                    font-size: 16px;
                    font-weight: 600;
                    color: #2D2A3E;
                    text-align: center;
                }
                .nav-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: #9E9E9E;
                    cursor: pointer;
                    padding: 0 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .calendar-dates-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 4px;
                    padding: 0 12px;
                }
                .calendar-date {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    padding: 6px 0;
                    cursor: pointer;
                    border-radius: 24px;
                    transition: all 0.2s ease;
                    min-height: 56px;
                }
                .calendar-date.future {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
                .calendar-date.today {
                    background: rgba(139, 127, 220, 0.1);
                    position: relative;
                }
                .calendar-date.today::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    border-radius: 24px;
                    padding: 2px;
                    background: linear-gradient(135deg, #8B7FDC, #A599E8, #8B7FDC);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    animation: glow 2s ease-in-out infinite;
                }
                @keyframes glow {
                    0%, 100% { opacity:1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
                .calendar-date.selected:not(.today) {
                    background: #F8F7FC;
                }
                .date-weekday {
                    font-size: 11px;
                    font-weight: 500;
                    color: #999;
                }
                .date-number {
                    font-size: 16px;
                    font-weight: 600;
                    color: #2D2A3E;
                }
                .calendar-date.today .date-number {
                    color: #8B7FDC;
                }
                .date-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    margin-top: 2px;
                }
                .date-dot.perfect {
                    background: #8B7FDC; /* 보라색: 완벽 */
                }
                .date-dot.partial {
                    background: #FF9800; /* 주황색: 부분 성공 */
                }
                .date-dot.failed {
                    background: #BDBDBD; /* 회색: 실패 */
                }

                .content-scroll-area {
                    padding: 20px 32px;
                }
                .section-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #2D2A3E;
                    margin-bottom: 12px;
                }

                /* Success Card */
                .success-card {
                    background: #E8F5E9; /* Light Green */
                    border-radius: 24px;
                    padding: 24px;
                    text-align: center;
                    margin-bottom: 20px;
                    position: relative;
                    overflow: hidden;
                }
                .badge-alarm {
                    display: inline-block;
                    background: rgba(255, 255, 255, 0.8);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    color: #FF5252;
                    font-weight: 600;
                    margin-bottom: 16px;
                }
                .badge-late {
                    display: inline-block;
                    background: rgba(255, 152, 0, 0.2);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    color: #E65100;
                    font-weight: 600;
                    margin-bottom: 16px;
                }
                .badge-manual {
                    display: inline-block;
                    background: rgba(139, 127, 220, 0.2);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    color: #5E35B1;
                    font-weight: 600;
                    margin-bottom: 16px;
                }
                .badge-pre-auth {
                    display: inline-block;
                    background: rgba(76, 175, 80, 0.2);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    color: #2E7D32;
                    font-weight: 600;
                    margin-bottom: 16px;
                }
                .success-card.late {
                    background: #FFF3E0; /* Light Orange */
                }
                .success-icon { font-size: 24px; margin-bottom: 8px; }
                .success-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #2D2A3E;
                    margin-bottom: 4px;
                }
                .success-time {
                    font-size: 32px;
                    font-weight: 700;
                    color: #4CAF50;
                    margin-bottom: 8px;
                    font-variant-numeric: tabular-nums;
                }
                .success-message {
                    font-size: 13px;
                    color: #666;
                }

                /* Photo Card */
                .photo-card {
                    border: 2px dashed #D1D1D6;
                    border-radius: 24px;
                    height: 300px; /* Taller as per image */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    margin-bottom: 32px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .photo-card:active { background: #F8F7FC; }
                .photo-placeholder {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }
                .camera-icon { font-size: 32px; color: #9E9E9E; }
                .photo-text {
                    font-size: 14px;
                    color: #666;
                }
                .add-btn {
                    width: 40px;
                    height: 40px;
                    background: #8B7FDC;
                    border-radius: 50%;
                    color: white;
                    font-size: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-bottom: 4px; /* Visual adjustment */
                }

                /* Stats Row */
                .stats-row {
                    display: flex;
                    gap: 12px;
                }
                .stat-item {
                    flex: 1;
                    background: white;
                    padding: 16px 12px;
                    border-radius: 16px;
                    text-align: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.03);
                }
                .stat-value-row {
                    display: flex;
                    align-items: baseline;
                    justify-content: center;
                    gap: 2px;
                    margin-bottom: 4px;
                }
                .stat-num {
                    font-size: 20px;
                    font-weight: 700;
                    color: #8B7FDC;
                }
                .stat-unit {
                    font-size: 12px;
                    color: #8B7FDC;
                    font-weight: 600;
                }
                .stat-label {
                    font-size: 11px;
                    color: #9E9E9E;
                }
            `}</style>
        </div>
    );
};

// Sub-component for Wake Up Card to keep Dashboard clean
const WakeUpCard = ({ selectedDate, selectedRecord, targetTime, updateRecord, todayStr }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showManualInput, setShowManualInput] = useState(false);
    // Changed manualTime to object for TimePicker24h
    const [manualTime, setManualTime] = useState({ hours: '08', minutes: '00' });

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const isToday = (date) => {
        const now = new Date();
        return date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();
    };

    // Helper to parse "07:00" (24h) to minutes
    // Debug UI
    // console.log('Selected Record:', selectedRecord);

    const parseTimeStr = (timeStr) => {
        if (!timeStr) return 0;
        // Handle legacy AM/PM if present
        if (timeStr.includes(' ')) {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            return hours * 60 + minutes;
        }
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Determine State
    const getCardState = () => {
        // If viewing past date
        if (!isToday(selectedDate)) {
            if (selectedRecord.wake) return 'success';
            return 'past_fail'; // Or just empty state for past
        }

        const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
        const targetMins = parseTimeStr(targetTime);

        // Define Time Ranges
        // Active: Target ± 60 mins
        const activeStart = targetMins - 60;
        const activeEnd = targetMins + 60;

        // Bedtime: Target + 16 hours (960 mins)
        const bedtimeMins = targetMins + 960;

        // Ready: Bedtime - 3 hours (180 mins)
        const readyStart = bedtimeMins - 180;

        // 1. Sleep State (Post-Bedtime): Current >= Bedtime
        // Note: This handles late night today. 
        if (currentMins >= bedtimeMins) return 'sleep';

        // 2. Ready State: ReadyStart <= Current < Bedtime
        if (currentMins >= readyStart) return 'ready';

        // 3. Sleep State (Pre-Wake): Current < ActiveStart
        if (currentMins < activeStart) return 'sleep';

        // 4. Active State: ActiveStart <= Current <= ActiveEnd
        if (currentMins <= activeEnd) {
            // If already verified, show Success
            if (selectedRecord.wake && selectedRecord.isSuccess !== false) return 'success';
            return 'active';
        }

        // 5. Fail/Success State (Daytime): ActiveEnd < Current < ReadyStart
        // If verified (wake is true), show result (success or late)
        if (selectedRecord.wake) return 'success';

        // If not verified
        return 'fail';
    };

    const cardState = getCardState();

    // Handlers
    const handleWakeUp = () => {
        updateRecord(todayStr, {
            wake: true,
            wakeTime: new Date().toISOString(),
            verificationType: 'pre-auth',
            isSuccess: true, // Auto success for button click
            completed: false
        });
    };

    const handleManualSubmit = () => {
        // Parse manual time from object
        const h = parseInt(manualTime.hours);
        const m = parseInt(manualTime.minutes);

        const manualDate = new Date();
        manualDate.setHours(h, m, 0, 0);

        // Re-evaluate Success/Fail
        const manualMins = h * 60 + m;
        const targetMins = parseTimeStr(targetTime);
        const diff = Math.abs(manualMins - targetMins);

        // Success if within ±60 mins
        const isSuccess = diff <= 60;

        updateRecord(todayStr, {
            wake: true,
            wakeTime: manualDate.toISOString(),
            isManual: true,
            verificationType: 'manual',
            isSuccess: isSuccess,
            completed: false
        });

        // Use setTimeout to ensure state update completes before closing modal
        setTimeout(() => {
            setShowManualInput(false);
        }, 500);
    };

    // Render based on state
    if (cardState === 'success') {
        // Determine badge based on verificationType and Success Status
        let badgeText = '✨ 기상 완료';
        let badgeClass = 'badge-default';

        if (selectedRecord.isSuccess === false) {
            badgeText = '😅 늦은 기상';
            badgeClass = 'badge-late';
        } else if (selectedRecord.verificationType === 'pre-auth') {
            badgeText = '✨ 사전 인증';
            badgeClass = 'badge-pre-auth';
        } else if (selectedRecord.verificationType === 'alarm') {
            badgeText = '⏰ 알람 인증';
            badgeClass = 'badge-alarm';
        } else if (selectedRecord.verificationType === 'manual') {
            badgeText = '✍️ 직접 인증';
            badgeClass = 'badge-manual';
        }

        return (
            <div className={`success-card ${selectedRecord.isSuccess === false ? 'late' : ''}`}>
                <div className={badgeClass}>{badgeText}</div>
                <div className="success-icon">{selectedRecord.isSuccess === false ? '😅' : '✨'}</div>
                <div className="success-title">{selectedRecord.isSuccess === false ? '기상 기록 완료' : '기상 인증 완료'}</div>
                <div className="success-time" style={{ color: selectedRecord.isSuccess === false ? '#FF9800' : '#4CAF50' }}>
                    {selectedRecord.wakeTime ? new Date(selectedRecord.wakeTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }) : "00:00"}
                </div>
                <div className="success-message">
                    {selectedRecord.morningNote ? "오늘의 기록까지 완벽해요!" : (selectedRecord.isSuccess === false ? "내일은 목표 시간에 도전해보세요!" : "오늘 하루도 힘차게 시작해봐요!")}
                </div>
            </div>
        );
    }

    if (cardState === 'past_fail') {
        return (
            <div className="empty-card" style={{
                background: '#F0F0F5', borderRadius: '24px', padding: '16px 20px',
                textAlign: 'center', marginBottom: '20px', color: '#9E9E9E'
            }}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>😴</div>
                <div>기상 기록이 없습니다</div>
            </div>
        );
    }

    // Fail State
    if (cardState === 'fail') {
        return (
            <div className="wake-card fail">
                <div className="wake-card-icon">😅</div>
                <div className="wake-card-title">기상 시간을 놓쳤나요?</div>
                <div className="wake-card-desc">늦게라도 기록을 남겨보세요</div>
                <button className="btn-wake outline" onClick={() => setShowManualInput(true)}>
                    직접 입력하기
                </button>

                {/* Manual Input Modal */}
                {showManualInput && (
                    <div className="modal-overlay" onClick={(e) => {
                        if (e.target === e.currentTarget) setShowManualInput(false);
                    }}>
                        <div className="modal fade-in" style={{ padding: '20px' }}>
                            <div className="modal-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 className="modal-title" style={{ fontSize: '18px', fontWeight: '700' }}>기상 시간 입력</h3>
                                <button className="modal-close" onClick={() => setShowManualInput(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                            </div>
                            <div className="modal-body" style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                                <TimePicker24h time={manualTime} setTime={setManualTime} />
                            </div>
                            <div className="modal-actions" style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn-text" onClick={() => setShowManualInput(false)} style={{ flex: 1, padding: '16px', borderRadius: '16px', background: '#F5F5F5', border: 'none', fontSize: '16px', fontWeight: '600', color: '#666' }}>취소</button>
                                <button className="btn-primary" onClick={handleManualSubmit} style={{ flex: 1 }}>확인</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Ready State (Pre-Bedtime)
    if (cardState === 'ready') {
        const targetMins = parseTimeStr(targetTime);
        const bedtimeMins = targetMins + 960; // 16h after wake
        const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();

        let diffMins = bedtimeMins - currentMins;
        if (diffMins < 0) diffMins = 0;

        const hoursLeft = Math.floor(diffMins / 60);
        const minsLeft = diffMins % 60;

        return (
            <div className="wake-card ready" style={{ background: '#E3F2FD' }}>
                <div className="wake-card-icon">🌙</div>
                <div className="wake-card-title" style={{ color: '#1565C0' }}>수면 준비 시간</div>
                <div className="wake-card-timer" style={{ color: '#1976D2' }}>
                    내일 기상 목표: {targetTime}<br />
                    <span className="highlight" style={{ color: '#0D47A1' }}>취침까지 {hoursLeft}시간 {minsLeft}분 남음</span>
                </div>
            </div>
        );
    }

    // Sleep State
    if (cardState === 'sleep') {
        const targetMins = parseTimeStr(targetTime);
        const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();

        let diffMins = targetMins - currentMins;
        if (diffMins < 0) diffMins += 1440; // Add 24h if target is next day

        const hoursLeft = Math.floor(diffMins / 60);
        const minsLeft = diffMins % 60;

        return (
            <div className="wake-card sleep" style={{ background: '#311B92', color: 'white' }}>
                <div className="wake-card-icon">💤</div>
                <div className="wake-card-title" style={{ color: 'white' }}>수면 중입니다</div>
                <div className="wake-card-timer" style={{ color: '#B39DDB' }}>
                    기상까지<br />
                    <span className="highlight" style={{ color: 'white' }}>{hoursLeft}시간 {minsLeft}분</span>
                </div>
                <button className="btn-wake disabled" disabled style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)' }}>
                    아직 기다려주세요
                </button>
            </div>
        );
    }

    // Active State (Default fallthrough if logic matches)
    if (cardState === 'active') {
        return (
            <div className="wake-card active">
                <div className="wake-card-icon">☀️</div>
                <div className="wake-card-title">일어날 시간이에요!</div>
                <div className="wake-card-timer">
                    목표 {targetTime}
                </div>
                <button className="btn-wake" onClick={handleWakeUp}>
                    ☀️ 지금 일어났어요!
                </button>
            </div>
        );
    }

    return null;
};

// MorningLogCard Component
// MorningLogCard Component
const MorningLogCard = ({ selectedDate, selectedRecord, updateRecord, todayStr, morningTheme }) => {
    const [showModal, setShowModal] = useState(false);

    const isToday = (date) => {
        const now = new Date();
        return date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();
    };

    const isFuture = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(date);
        target.setHours(0, 0, 0, 0);
        return target > today;
    };


    const hasLog = selectedRecord.morningNote || selectedRecord.photoUrl;

    const handleOpenModal = () => {
        if (isFuture(selectedDate)) return;
        setShowModal(true);
    };

    const handleSave = async (noteText, photoPreview) => {
        if (!photoPreview && !noteText) {
            alert('사진이나 텍스트 중 하나는 필수입니다.');
            return;
        }

        const dateStr = isToday(selectedDate)
            ? todayStr
            : `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

        try {
            updateRecord(dateStr, {
                morningNote: noteText,
                photoUrl: photoPreview,
                completed: (selectedRecord.wake && (noteText || photoPreview)) ? true : false
            });

            // Use setTimeout to ensure state update completes before closing modal
            setTimeout(() => {
                setShowModal(false);
            }, 100);
        } catch (error) {
            console.error('Save failed:', error);
            if (error.name === 'QuotaExceededError') {
                alert('저장 공간이 부족합니다. 사진 크기를 줄이거나 이전 기록을 삭제해주세요.');
            } else {
                alert('저장 중 오류가 발생했습니다.');
            }
        }
    };

    // Empty State UI
    if (!hasLog) {
        return (
            <>
                <div
                    className={`morning-log-card empty ${isFuture(selectedDate) ? 'disabled' : ''}`}
                    onClick={handleOpenModal}
                >
                    <div className="camera-icon">📷</div>
                    <div className="morning-log-text">
                        {`${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일, 오늘의 순간을 기록으로 남겨 기억하세요.`}
                    </div>
                    <div className="add-btn">+</div>
                </div>

                <MorningLogModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    record={selectedRecord}
                    onSave={handleSave}
                />
            </>
        );
    }

    // Full Image State UI (Instagram-style)
    return (
        <>
            <div
                className="morning-log-card filled"
                onClick={handleOpenModal}
            >
                <div className="morning-log-overlay">
                    {selectedRecord.photoUrl ? (
                        <div className="photo-container">
                            <img src={selectedRecord.photoUrl} alt="Morning Log" className="log-photo" />
                            <div className="dimmed-layer"></div>
                        </div>
                    ) : (
                        <div className="default-bg"></div>
                    )}
                    <div className="morning-log-content">
                        {!selectedRecord.photoUrl && <div className="default-icon">✨</div>}
                        <div className="morning-log-theme">{morningTheme?.name || '오늘의 기록'}</div>
                        <div className="morning-log-note">{selectedRecord.morningNote || '오늘의 기록'}</div>
                    </div>
                </div>
            </div>

            <MorningLogModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                record={selectedRecord}
                onSave={handleSave}
            />
        </>
    );
};

export default Dashboard;
