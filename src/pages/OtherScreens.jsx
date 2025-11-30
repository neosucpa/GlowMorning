import React, { useState } from 'react';
// Re-saving file to ensure latest version is used
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ToggleSwitch from '../components/ToggleSwitch';
import TimePicker24h from '../components/TimePicker24h';
import BottomNav from '../components/BottomNav';
import CalendarView from '../components/CalendarView';
import FeedView from '../components/FeedView';
import MorningLogModal from '../components/MorningLogModal';
import StreakCard from '../components/Stats/StreakCard';
import WeeklyChart from '../components/Stats/WeeklyChart';
import InsightCard from '../components/Stats/InsightCard';
import BadgeGroup from '../components/Challenge/BadgeGroup';
import { BADGE_GROUPS, BADGES } from '../constants/badges';
import { getTodayStr } from '../utils/dateUtils';
import { calculateStreak, getWeeklyData, getBestDay, getMonthlySuccessRate } from '../utils/statsUtils';
import { calculateAllBadges } from '../utils/badgeUtils';
import '../index.css';

const PageLayout = ({ title, children }) => (
    <div className="page-screen" style={{ padding: '24px', paddingBottom: '100px', minHeight: '100vh', background: '#F8F7FC' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: 'var(--color-text-primary)' }}>{title}</h1>
        {children}
        <BottomNav />
    </div>
);

// Records Page
export const Records = () => {
    const { appState, updateRecord } = useApp();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    // Filter records for selected month
    const monthRecords = [];
    Object.entries(appState.records || {}).forEach(([date, record]) => {
        const recordDate = new Date(date);
        if (recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear) {
            monthRecords.push({ ...record, date });
        }
    });

    const handleMonthChange = (direction) => {
        if (direction === 'prev') {
            if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
            } else {
                setSelectedMonth(selectedMonth - 1);
            }
        } else {
            if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear(selectedYear + 1);
            } else {
                setSelectedMonth(selectedMonth + 1);
            }
        }
    };

    const handleEdit = (record) => {
        setSelectedRecord(record);
        setShowEditModal(true);
    };

    const handleSave = (noteText, photoPreview) => {
        console.log('Records handleSave called:', { noteText, photoPreview: photoPreview ? 'exists' : 'null', selectedRecord });

        if (!photoPreview && !noteText) {
            alert('사진이나 텍스트 중 하나는 필수입니다.');
            return;
        }

        try {
            console.log('Updating record for date:', selectedRecord.date);
            updateRecord(selectedRecord.date, {
                morningNote: noteText,
                photoUrl: photoPreview,
                completed: (selectedRecord.wake && (noteText || photoPreview)) ? true : false
            });
            console.log('Record updated successfully');
            setShowEditModal(false);
        } catch (error) {
            console.error('Save failed:', error);
            alert('저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <PageLayout title="기록">
            <div style={{ marginBottom: '20px' }}>
                <CalendarView
                    records={appState.records || {}}
                    currentMonth={selectedMonth}
                    currentYear={selectedYear}
                    onMonthChange={handleMonthChange}
                    onPrevMonth={() => handleMonthChange('prev')}
                    onNextMonth={() => handleMonthChange('next')}
                    onDateClick={() => { }} // Optional date click handler
                />
            </div>
            <FeedView records={monthRecords} onEdit={handleEdit} />
            {showEditModal && selectedRecord && (
                <MorningLogModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    record={selectedRecord}
                    onSave={handleSave}
                />
            )}
        </PageLayout>
    );
};

// Stats Page
export const Stats = () => {
    const { appState, userData } = useApp();
    const todayStr = getTodayStr();

    const currentStreak = calculateStreak(appState.records, todayStr, userData.excludeWeekends || false);
    const totalDays = Object.values(appState.records || {}).filter(r => r.wake).length;
    const weeklyData = getWeeklyData(appState.records, todayStr);
    const bestDay = getBestDay(appState.records || {});
    const monthlyRate = getMonthlySuccessRate(appState.records || {});

    return (
        <PageLayout title="통계">
            <StreakCard streak={currentStreak} totalWakeups={totalDays} />
            <WeeklyChart data={weeklyData} />
            <InsightCard bestDays={bestDay ? bestDay.split(', ') : ['-']} monthlyRate={monthlyRate} />
        </PageLayout>
    );
};

// Challenge Page
export const Challenge = () => {
    const { appState } = useApp();
    const badgeStatus = calculateAllBadges(appState.records || {}, BADGES);

    return (
        <PageLayout title="챌린지">
            {Object.values(BADGE_GROUPS).map(group => (
                <BadgeGroup
                    key={group.id}
                    title={group.name}
                    badges={badgeStatus.filter(b => b.group === group.id)}
                />
            ))}
        </PageLayout>
    );
};

// Modal Component
const Modal = ({ title, children, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{title}</h3>
            {children}
        </div>
    </div>
);

// Settings Page
export const Settings = () => {
    const { userData, updateUserData, appState } = useApp();
    const navigate = useNavigate();

    // Local state for edit modals
    const [showUsernameEdit, setShowUsernameEdit] = useState(false);
    const [showTargetTimeEdit, setShowTargetTimeEdit] = useState(false);
    const [showRecordReminderEdit, setShowRecordReminderEdit] = useState(false);

    const [tempUsername, setTempUsername] = useState(userData.username || '');
    const [tempTargetTime, setTempTargetTime] = useState({
        hours: userData.targetWakeTime?.split(':')[0] || '05',
        minutes: userData.targetWakeTime?.split(':')[1]?.replace(/[^0-9]/g, '') || '30'
    });
    const [tempRecordReminderTime, setTempRecordReminderTime] = useState({
        hours: userData.notifications?.recordReminder?.time?.split(':')[0] || '21',
        minutes: userData.notifications?.recordReminder?.time?.split(':')[1] || '00'
    });

    // Handlers
    const handleAlarmToggle = (enabled) => {
        updateUserData({ alarmEnabled: enabled });
    };

    const handleWeekendToggle = (enabled) => {
        updateUserData({ excludeWeekends: enabled });
        setTimeout(() => window.location.reload(), 300);
    };

    const handleRecordReminderToggle = (enabled) => {
        updateUserData({
            notifications: {
                ...userData.notifications,
                recordReminder: {
                    ...userData.notifications?.recordReminder,
                    enabled
                }
            }
        });
    };

    const handleSleepReminderToggle = (enabled) => {
        updateUserData({
            notifications: {
                ...userData.notifications,
                sleepReminder: {
                    ...userData.notifications?.sleepReminder,
                    enabled
                }
            }
        });
    };

    const handleUsernameSave = () => {
        if (!tempUsername.trim()) {
            alert('이름을 입력해주세요.');
            return;
        }
        updateUserData({ username: tempUsername });
        setShowUsernameEdit(false);
    };

    const handleTargetTimeSave = () => {
        updateUserData({ targetWakeTime: `${tempTargetTime.hours}:${tempTargetTime.minutes}` });
        setShowTargetTimeEdit(false);
    };

    const handleRecordReminderTimeSave = () => {
        updateUserData({
            notifications: {
                ...userData.notifications,
                recordReminder: {
                    ...userData.notifications?.recordReminder,
                    time: `${tempRecordReminderTime.hours}:${tempRecordReminderTime.minutes}`
                }
            }
        });
        setShowRecordReminderEdit(false);
    };

    const handleSleepReminderChange = (minutesBefore) => {
        updateUserData({
            notifications: {
                ...userData.notifications,
                sleepReminder: {
                    ...userData.notifications?.sleepReminder,
                    minutesBefore
                }
            }
        });
    };

    const handleBackup = () => {
        const backupData = {
            userData,
            appState: {
                records: appState.records,
                currentStreak: appState.currentStreak,
                totalDays: appState.totalDays
            },
            exportDate: new Date().toISOString()
        };
        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `glowmorning_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        alert('백업이 완료되었습니다.');
    };

    const handleRestore = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (!data.userData || !data.appState) {
                        alert('올바른 백업 파일이 아닙니다.');
                        return;
                    }

                    const confirmed = confirm('현재 데이터를 덮어쓰게 됩니다. 계속하시겠습니까?');
                    if (!confirmed) return;

                    localStorage.setItem('glowmorning_user', JSON.stringify(data.userData));
                    localStorage.setItem('glowmorning_app_state', JSON.stringify(data.appState));
                    alert('복원이 완료되었습니다. 페이지를 새로고침합니다.');
                    window.location.reload();
                } catch (error) {
                    alert('파일을 읽는 중 오류가 발생했습니다.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    return (
        <PageLayout title="설정">
            {/* 개인 정보 */}
            <div className="settings-section">
                <h3 className="section-title">개인 정보</h3>

                <div className="settings-item" style={{ cursor: 'default' }}>
                    <div className="item-left">
                        <span className="item-label">사용자 이름</span>
                        <span className="item-value">{userData.username || '설정 안됨'}</span>
                    </div>
                    <button className="edit-btn" onClick={() => { setTempUsername(userData.username || ''); setShowUsernameEdit(true); }}>수정</button>
                </div>

                <div className="settings-item" onClick={() => navigate('/pledge', { state: { viewMode: true } })}>
                    <span>서약서 보기/재작성</span>
                    <span>›</span>
                </div>
            </div>

            {/* 목표 설정 */}
            <div className="settings-section">
                <h3 className="section-title">목표 설정</h3>

                <div className="settings-item" style={{ cursor: 'default' }}>
                    <div className="item-left">
                        <span className="item-label">목표 기상 시간</span>
                        <span className="item-value">{userData.targetWakeTime || '05:30'}</span>
                    </div>
                    <button className="edit-btn" onClick={() => setShowTargetTimeEdit(true)}>수정</button>
                </div>

                <div className="settings-item" style={{ cursor: 'default' }}>
                    <span>주말 제외 (연속 카운트)</span>
                    <ToggleSwitch
                        enabled={userData.excludeWeekends || false}
                        onToggle={handleWeekendToggle}
                    />
                </div>
            </div>

            {/* 알람 설정 */}
            <div className="settings-section">
                <h3 className="section-title">알람</h3>

                <div className="settings-item" style={{ cursor: 'default' }}>
                    <span>알람 활성화</span>
                    <ToggleSwitch
                        enabled={userData.alarmEnabled !== false}
                        onToggle={handleAlarmToggle}
                    />
                </div>
            </div>

            {/* 알림 설정 */}
            <div className="settings-section">
                <h3 className="section-title">알림</h3>

                <div className="settings-item" style={{ cursor: 'default' }}>
                    <span>오늘의 기록 미작성 알림</span>
                    <ToggleSwitch
                        enabled={userData.notifications?.recordReminder?.enabled || false}
                        onToggle={handleRecordReminderToggle}
                    />
                </div>

                {userData.notifications?.recordReminder?.enabled && (
                    <div className="settings-sub-item" onClick={() => setShowRecordReminderEdit(true)}>
                        <span className="sub-label">알림 시간</span>
                        <span className="sub-value">{userData.notifications.recordReminder.time}</span>
                    </div>
                )}

                <div className="settings-item" style={{ cursor: 'default' }}>
                    <span>수면 준비 알림</span>
                    <ToggleSwitch
                        enabled={userData.notifications?.sleepReminder?.enabled || false}
                        onToggle={handleSleepReminderToggle}
                    />
                </div>

                {userData.notifications?.sleepReminder?.enabled && (
                    <div className="settings-sub-item" style={{ cursor: 'default' }}>
                        <span className="sub-label">알림 시간</span>
                        <select
                            value={userData.notifications.sleepReminder.minutesBefore}
                            onChange={(e) => handleSleepReminderChange(parseInt(e.target.value))}
                            className="time-select"
                        >
                            <option value={30}>30분 전</option>
                            <option value={60}>1시간 전</option>
                            <option value={90}>1시간 30분 전</option>
                        </select>
                    </div>
                )}
            </div>

            {/* 데이터 관리 */}
            <div className="settings-section">
                <h3 className="section-title">데이터</h3>

                <div className="settings-item" onClick={handleBackup}>
                    <span>백업하기</span>
                    <span>›</span>
                </div>

                <div className="settings-item" onClick={handleRestore}>
                    <span>가져오기</span>
                    <span>›</span>
                </div>
            </div>

            {/* 앱 정보 */}
            <div className="settings-section">
                <h3 className="section-title">앱 정보</h3>

                <div className="settings-item" style={{ cursor: 'default' }}>
                    <span>버전 정보</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>v0.1.0</span>
                </div>
            </div>

            {/* Modals */}
            {showUsernameEdit && <Modal title="사용자 이름 변경" onClose={() => setShowUsernameEdit(false)}>
                <input
                    type="text"
                    className="modal-input"
                    placeholder="이름을 입력하세요"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    maxLength={10}
                />
                <div className="modal-buttons">
                    <button className="btn-secondary" onClick={() => setShowUsernameEdit(false)}>취소</button>
                    <button className="btn-primary-settings" onClick={handleUsernameSave}>저장</button>
                </div>
            </Modal>}

            {showTargetTimeEdit && <Modal title="목표 기상 시간 변경" onClose={() => setShowTargetTimeEdit(false)}>
                <TimePicker24h time={tempTargetTime} setTime={setTempTargetTime} />
                <div className="modal-buttons">
                    <button className="btn-secondary" onClick={() => setShowTargetTimeEdit(false)}>취소</button>
                    <button className="btn-primary-settings" onClick={handleTargetTimeSave}>저장</button>
                </div>
            </Modal>}

            {showRecordReminderEdit && <Modal title="알림 시간 설정" onClose={() => setShowRecordReminderEdit(false)}>
                <TimePicker24h time={tempRecordReminderTime} setTime={setTempRecordReminderTime} />
                <div className="modal-buttons">
                    <button className="btn-secondary" onClick={() => setShowRecordReminderEdit(false)}>취소</button>
                    <button className="btn-primary-settings" onClick={handleRecordReminderTimeSave}>저장</button>
                </div>
            </Modal>}

            <style>{`
                .settings-section {
                    background: white;
                    border-radius: 16px;
                    padding: 16px;
                    margin-bottom: 16px;
                }
                .section-title {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--color-text-secondary);
                    margin-bottom: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .settings-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 14px 0;
                    border-bottom: 1px solid #F0F0F0;
                    cursor: pointer;
                }
                .settings-item:last-child {
                    border-bottom: none;
                }
                .item-left {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .item-label {
                    font-size: 15px;
                    color: var(--color-text-primary);
                }
                .item-value {
                    font-size: 13px;
                    color: var(--color-text-secondary);
                }
                .edit-btn {
                    padding: 6px 16px;
                    background: #F0F0F0;
                    border: none;
                    border-radius: 8px;
                    font-size: 13px;
                    cursor: pointer;
                    color: var(--color-text-primary);
                }
                .edit-btn:hover {
                    background: #E0E0E0;
                }
                .settings-sub-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0 12px 20px;
                    border-bottom: 1px solid #F0F0F0;
                    cursor: pointer;
                }
                .sub-label {
                    font-size: 14px;
                    color: var(--color-text-secondary);
                }
                .sub-value {
                    font-size: 14px;
                    color: var(--color-primary);
                    font-weight: 600;
                }
                .time-select {
                    padding: 6px 12px;
                    border: 1px solid #E0E0E0;
                    border-radius: 8px;
                    font-size: 14px;
                    color: var(--color-primary);
                    font-weight: 600;
                    cursor: pointer;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                    min-width: 300px;
                    max-width: 400px;
                }
                .modal-title {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .modal-input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #E0E0E0;
                    border-radius: 12px;
                    font-size: 16px;
                    margin-bottom: 20px;
                    box-sizing: border-box;
                }
                .modal-input:focus {
                    outline: none;
                    border-color: var(--color-primary);
                }
                .modal-buttons {
                    display: flex;
                    gap: 12px;
                    margin-top: 20px;
                }
                .btn-secondary {
                    flex: 1;
                    padding: 12px;
                    background: #F0F0F0;
                    border: none;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                }
                .btn-secondary:hover {
                    background: #E0E0E0;
                }
                .btn-primary-settings {
                    flex: 1;
                    padding: 12px;
                    background: var(--color-primary);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                }
                .btn-primary-settings:hover {
                    opacity: 0.9;
                }
            `}</style>
        </PageLayout>
    );
};
