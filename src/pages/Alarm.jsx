import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getTodayStr } from '../utils/dateUtils';
import '../index.css';

const Alarm = () => {
    const navigate = useNavigate();
    const { appState, updateRecord } = useApp();
    const [startY, setStartY] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const todayStr = getTodayStr();

    // Touch Handlers
    const handleTouchStart = (e) => {
        setStartY(e.touches[0].clientY);
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const currentY = e.touches[0].clientY;
        const diff = startY - currentY;
        if (diff > 0) {
            setOffsetY(diff);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (offsetY > 100) { // Threshold to dismiss
            dismissAlarm();
        } else {
            setOffsetY(0); // Reset
        }
    };

    // Mouse Handlers for testing on desktop
    const handleMouseDown = (e) => {
        setStartY(e.clientY);
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const currentY = e.clientY;
        const diff = startY - currentY;
        if (diff > 0) {
            setOffsetY(diff);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (offsetY > 100) {
            dismissAlarm();
        } else {
            setOffsetY(0);
        }
    };

    const dismissAlarm = () => {
        updateRecord(todayStr, {
            alarmDismissed: true,
            dismissTime: new Date().toISOString()
        });
        navigate('/ritual');
    };

    return (
        <div
            className="alarm-screen"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { setIsDragging(false); setOffsetY(0); }}
        >
            <div className="alarm-content" style={{ transform: `translateY(${-offsetY * 0.5}px)`, opacity: Math.max(0, 1 - offsetY / 300) }}>
                <div className="alarm-time">{appState.currentTime.split(' ')[0]}</div>
                <div className="alarm-date">
                    {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                </div>

                <div className="alarm-message">
                    좋은 아침입니다!<br />
                    당신의 빛나는 아침이<br />
                    시작됩니다
                </div>

                <div className="alarm-sun">☀️</div>
            </div>

            <div className="swipe-hint" style={{ opacity: Math.max(0, 0.7 - offsetY / 200) }}>
                <div className="swipe-arrow">↑</div>
                <div className="swipe-text">위로 스와이프하여 알람 해제</div>
            </div>

            <style>{`
                .alarm-screen {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
                    background: linear-gradient(180deg, #1A1A2E 0%, #2D2A3E 50%, #4A4458 100%);
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    color: white; z-index: 1000; overflow: hidden; user-select: none;
                }
                .alarm-time { font-size: 80px; font-weight: 300; margin-bottom: 16px; letter-spacing: -2px; }
                .alarm-date { font-size: 18px; font-weight: 400; opacity: 0.8; margin-bottom: 48px; }
                .alarm-message { font-size: 20px; font-weight: 500; line-height: 1.6; text-align: center; margin-bottom: 48px; opacity: 0.9; }
                .alarm-sun { font-size: 100px; margin: 48px 0; animation: pulse 2s ease-in-out infinite; }
                @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.15); opacity: 1; } }
                .swipe-hint { position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 12px; opacity: 0.7; }
                .swipe-arrow { font-size: 32px; animation: swipeUp 1.5s ease-in-out infinite; }
                @keyframes swipeUp { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
                .swipe-text { font-size: 14px; font-weight: 500; }
            `}</style>
        </div>
    );
};

export default Alarm;
