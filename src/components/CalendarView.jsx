import React from 'react';
import '../index.css';

const CalendarView = ({ currentMonth, currentYear, records, onDateClick, onPrevMonth, onNextMonth, onMonthChange }) => {
    const year = currentYear;
    const month = currentMonth;

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Days in month
    const daysInMonth = lastDay.getDate();

    // Day of week of the first day (0-6, Sun-Sat)
    const startDayOfWeek = firstDay.getDay();

    // Generate calendar grid
    const calendarDays = [];

    // Empty slots for previous month
    for (let i = 0; i < startDayOfWeek; i++) {
        calendarDays.push(null);
    }

    // Days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(new Date(year, month, i));
    }

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    const getRecordStatus = (date) => {
        if (!date) return null;
        const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const record = records[dateStr];

        if (!record) return null;
        if (record.photoUrl) return 'photo';
        if (record.morningNote) return 'note';
        if (record.wake) return 'wake';
        return null;
    };

    return (
        <div className="calendar-view">
            <div className="calendar-header">
                <button className="nav-btn" onClick={onPrevMonth}>‹</button>
                <div className="month-title">
                    {year}년 {month + 1}월
                </div>
                <button className="nav-btn" onClick={onNextMonth}>›</button>
            </div>

            <div className="weekdays-row">
                {weekDays.map((day, index) => (
                    <div key={index} className="weekday" style={{ color: index === 0 ? '#FF5757' : index === 6 ? '#5C6BC0' : '#999' }}>
                        {day}
                    </div>
                ))}
            </div>

            <div className="days-grid">
                {calendarDays.map((date, index) => {
                    if (!date) return <div key={`empty-${index}`} className="day-cell empty"></div>;

                    const status = getRecordStatus(date);
                    const isToday = new Date().toDateString() === date.toDateString();
                    const isSelected = false; // Can add selection logic later

                    return (
                        <div
                            key={date.toISOString()}
                            className={`day-cell ${isToday ? 'today' : ''}`}
                            onClick={() => onDateClick(date)}
                        >
                            <span className="day-number">{date.getDate()}</span>
                            {status && (
                                <div className={`day-dot ${status}`}></div>
                            )}
                        </div>
                    );
                })}
            </div>

            <style>{`
                .calendar-view {
                    background: white;
                    border-radius: 24px;
                    padding: 20px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                    margin-bottom: 24px;
                }
                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .month-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #2D2A3E;
                }
                .nav-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: #9E9E9E;
                    cursor: pointer;
                    padding: 0 10px;
                }
                .weekdays-row {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    text-align: center;
                    margin-bottom: 12px;
                }
                .weekday {
                    font-size: 12px;
                    font-weight: 500;
                }
                .days-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    row-gap: 16px;
                }
                .day-cell {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 40px;
                    cursor: pointer;
                    position: relative;
                }
                .day-number {
                    font-size: 14px;
                    color: #2D2A3E;
                    z-index: 1;
                }
                .day-cell.today .day-number {
                    color: white;
                    background: #8B7FDC;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }
                .day-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    margin-top: 4px;
                }
                .day-dot.photo { background: #FF9800; } /* Orange for photo */
                .day-dot.note { background: #8B7FDC; } /* Purple for note */
                .day-dot.wake { background: #4CAF50; } /* Green for just wake */
            `}</style>
        </div>
    );
};

export default CalendarView;
