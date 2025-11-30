import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getTodayStr } from '../utils/dateUtils';
import alarmBg from '../assets/alarm_bg.jpg';
import '../index.css';

const Alarm = () => {
    const navigate = useNavigate();
    const { appState, userData, updateRecord } = useApp();
    const [startY, setStartY] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // Alarm State
    const [brightness, setBrightness] = useState(0.5); // Start at 50% brightness
    const [volume, setVolume] = useState(0.05); // Start very quiet
    const audioRef = useRef(null);
    const intervalRef = useRef(null);

    const todayStr = getTodayStr();
    const userName = userData.username || "사용자";

    // Initialize Audio
    useEffect(() => {
        // Create audio element with gentle morning nature sound
        // Local file: Morning birds singing (gentle and soothing)
        const audio = new Audio('/morning_alarm.mp3');
        audio.loop = true;
        audio.volume = 0.05; // Start very quiet
        audioRef.current = audio;

        // Play audio (might be blocked by browser policy without interaction, but we'll try)
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log("Alarm audio playing successfully");
                })
                .catch(error => {
                    console.log("Audio play blocked by browser:", error);
                    // Show a message to user to tap the screen
                });
        }

        // Timer for increasing brightness and volume
        const startTime = Date.now();
        const duration = 15 * 60 * 1000; // 15 minutes to full brightness/volume

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Brightness: 0.5 -> 1.0
            setBrightness(0.5 + (progress * 0.5));

            // Volume: 0.05 -> 1.0 (gradually increase over 15 minutes)
            if (audioRef.current) {
                audioRef.current.volume = Math.min(0.05 + (progress * 0.95), 1);
            }
        }, 1000); // Update every second for smoothness

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, []);

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
        if (offsetY > 150) { // Threshold to dismiss
            dismissAlarm();
        } else {
            setOffsetY(0); // Reset
        }
    };

    // Mouse Handlers
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
        if (offsetY > 150) {
            dismissAlarm();
        } else {
            setOffsetY(0);
        }
    };

    const dismissAlarm = () => {
        // Stop audio
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Save record
        updateRecord(todayStr, {
            wake: true, // Mark wake up as done
            wakeTime: new Date().toISOString(),
            verificationType: 'alarm',
            completed: false // Still need to do morning note
        });

        // Navigate
        navigate('/dashboard');
    };

    // Handle click to start audio if blocked
    const handleScreenClick = () => {
        if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play()
                .then(() => console.log("Audio started after user interaction"))
                .catch(err => console.log("Audio play error:", err));
        }
    };

    // Format Date: "2025.01.06 월요일"
    const dateObj = new Date();
    const dateString = `${dateObj.getFullYear()}.${(dateObj.getMonth() + 1).toString().padStart(2, '0')}.${dateObj.getDate().toString().padStart(2, '0')}`;
    const weekDay = dateObj.toLocaleDateString('ko-KR', { weekday: 'long' });

    return (
        <div
            className="alarm-screen"
            onClick={handleScreenClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { setIsDragging(false); setOffsetY(0); }}
        >
            {/* Background Image with Dynamic Brightness */}
            <div
                className="alarm-bg"
                style={{
                    backgroundImage: `url(${alarmBg})`,
                    filter: `brightness(${brightness})`
                }}
            />

            {/* Content Overlay */}
            <div className="alarm-content" style={{ transform: `translateY(${-offsetY * 0.5}px)`, opacity: Math.max(0, 1 - offsetY / 400) }}>
                <div className="alarm-time-display">
                    {new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')}
                </div>
                <div className="alarm-date-display">
                    {dateString}<br />{weekDay}
                </div>

                <div className="alarm-greeting">
                    좋은 아침입니다, {userName}님<br />
                    <span className="sub-greeting">
                        당신의 빛나는 아침이<br />
                        시작됩니다
                    </span>
                </div>

                {/* Swipe Button Visual */}
                <div className="swipe-trigger-area">
                    <div className="swipe-circle">
                        <div className="swipe-arrow">^</div>
                    </div>
                    <div className="swipe-text">위로 밀어서 기상 체크</div>
                    <div className="snooze-text">[5분 뒤 다시 알림]</div>
                </div>
            </div>

            <style>{`
                .alarm-screen {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    color: white; z-index: 1000; overflow: hidden; user-select: none;
                }
                .alarm-bg {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-size: cover; background-position: center;
                    transition: filter 1s linear;
                    z-index: -1;
                }
                .alarm-content {
                    width: 100%; height: 100%;
                    display: flex; flex-direction: column; align-items: center;
                    padding-top: 280px;
                    background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%);
                }
                .alarm-time-display {
                    font-size: 72px; font-weight: 300; letter-spacing: 4px;
                    margin-bottom: 8px; font-family: 'Roboto', sans-serif;
                    width: 100%;
                    max-width: 90%;
                    text-align: center;
                    padding: 0 20px;
                }
                .alarm-date-display {
                    font-size: 14px; font-weight: 400; text-align: center;
                    color: rgba(255, 255, 255, 0.7); margin-bottom: 80px;
                    line-height: 1.4;
                }
                .alarm-greeting {
                    font-size: 18px; font-weight: 500; text-align: center;
                    margin-bottom: auto;
                }
                .sub-greeting {
                    font-size: 14px; font-weight: 400; color: rgba(255, 255, 255, 0.7);
                    display: block; margin-top: 8px;
                }
                
                .swipe-trigger-area {
                    margin-bottom: 120px;
                    display: flex; flex-direction: column; align-items: center; gap: 16px;
                }
                .swipe-circle {
                    width: 60px; height: 60px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 8px;
                    animation: bounce 2s infinite;
                }
                .swipe-arrow {
                    font-size: 24px; color: #4CAF50; font-weight: bold;
                    transform: scaleY(0.8);
                }
                .swipe-text {
                    font-size: 14px; color: #4CAF50; font-weight: 500;
                }
                .snooze-text {
                    font-size: 12px; color: rgba(255, 255, 255, 0.4); margin-top: 16px;
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                    40% {transform: translateY(-10px);}
                    60% {transform: translateY(-5px);}
                }
            `}</style>
        </div>
    );
};

export default Alarm;
