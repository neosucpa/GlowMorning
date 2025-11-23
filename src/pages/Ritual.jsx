import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getTodayStr } from '../utils/dateUtils';
import '../index.css';

const Ritual = () => {
    const navigate = useNavigate();
    const { updateRecord } = useApp();
    const todayStr = getTodayStr();

    const rituals = [
        { id: 'photo', name: '빛의 기록', desc: '창밖 촬영', icon: '📸' },
        { id: 'walk', name: '고요한 첫걸음', desc: '10걸음 걷기', icon: '🚶' },
        { id: 'water', name: '생명의 시작', desc: '물 한 잔', icon: '💧' },
        { id: 'stretch', name: '의식의 확장', desc: '스트레칭', icon: '🧘' },
    ];

    const handleRitual = (type) => {
        const ritualName = rituals.find(r => r.id === type)?.name;
        alert(`✨ ${ritualName}을 완료했어요!`);

        updateRecord(todayStr, {
            ritual: type,
            wake: true,
            timestamp: new Date().toISOString()
        });

        setTimeout(() => {
            navigate('/dashboard');
        }, 1000);
    };

    const handleSkip = () => {
        navigate('/dashboard');
    };

    return (
        <div className="ritual-screen">
            <div className="ritual-header">
                <h2 className="ritual-title">아침 기록으로<br />하루를 열어요</h2>
                <p className="ritual-subtitle">오늘의 아침 의식을 선택하세요</p>
            </div>

            <div className="ritual-grid">
                {rituals.map(r => (
                    <div key={r.id} className="ritual-card" onClick={() => handleRitual(r.id)}>
                        <div className="ritual-icon">{r.icon}</div>
                        <div className="ritual-name">{r.name}</div>
                        <div className="ritual-desc">{r.desc}</div>
                    </div>
                ))}
            </div>

            <button className="btn-skip" onClick={handleSkip}>
                나중에 하기
            </button>

            <style>{`
                .ritual-screen {
                    background: linear-gradient(180deg, #F8F7FC 0%, #E8E4F3 100%);
                    min-height: 100vh;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                }
                .ritual-header { text-align: center; margin-bottom: 32px; margin-top: 40px; }
                .ritual-title { font-size: 24px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 8px; }
                .ritual-subtitle { font-size: 15px; color: var(--color-text-secondary); }
                .ritual-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; flex: 1; }
                .ritual-card { background: white; border: 2px solid #E8E4F3; border-radius: 20px; padding: 32px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 160px; cursor: pointer; transition: all 300ms ease; box-shadow: var(--shadow-sm); }
                .ritual-card:hover { border-color: var(--color-primary); transform: translateY(-6px); box-shadow: var(--shadow-md); }
                .ritual-icon { font-size: 48px; margin-bottom: 16px; }
                .ritual-name { font-size: 16px; font-weight: 600; color: var(--color-text-primary); margin-bottom: 4px; }
                .ritual-desc { font-size: 13px; color: var(--color-text-secondary); }
                .btn-skip { width: 100%; height: 52px; background: white; color: var(--color-primary); border: 2px solid var(--color-primary); border-radius: 16px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 300ms ease; margin-bottom: 20px; }
                .btn-skip:hover { background: #F8F7FC; }
            `}</style>
        </div>
    );
};

export default Ritual;
