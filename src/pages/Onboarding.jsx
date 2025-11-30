import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { calculateTimeDifference, calculateBedtime } from '../utils/dateUtils';
import TimePicker24h from '../components/TimePicker24h';
import morningStretchImg from '../assets/morning_stretch.jpg';
import '../index.css';

const Onboarding = () => {
    const navigate = useNavigate();
    const { userData, updateUserData } = useApp();
    const [step, setStep] = useState(1);

    // Temporary state for onboarding inputs
    // Changed to 24h format (no period)
    const [wakeTime, setWakeTime] = useState({ hours: '08', minutes: '00' });
    const [targetTime, setTargetTime] = useState({ hours: '05', minutes: '30' });
    const [goal, setGoal] = useState('');
    const [resolution, setResolution] = useState(''); // Changed from theme to resolution
    const [sleepDuration, setSleepDuration] = useState(7);

    const totalSteps = 6;

    const nextStep = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            completeOnboarding();
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate('/');
        }
    };

    const completeOnboarding = () => {
        updateUserData({
            currentWakeTime: `${wakeTime.hours}:${wakeTime.minutes}`,
            targetWakeTime: `${targetTime.hours}:${targetTime.minutes}`,
            goal,
            resolution, // Save resolution
            sleepDuration,
            onboardingCompleted: true,
            completedAt: new Date().toISOString()
        });
        navigate('/pledge');
    };

    // Render Steps
    const renderStep = () => {
        switch (step) {
            case 1: return <Step1Welcome onNext={nextStep} />;
            case 2: return <Step2CurrentTime time={wakeTime} setTime={setWakeTime} onNext={nextStep} />;
            case 3: return <Step3TargetTime target={targetTime} current={wakeTime} setTime={setTargetTime} onNext={nextStep} />;
            case 4: return <Step4Goal goal={goal} setGoal={setGoal} onNext={nextStep} />;
            case 5: return <Step5Resolution resolution={resolution} setResolution={setResolution} onNext={nextStep} />;
            case 6: return <Step6Sleep duration={sleepDuration} setDuration={setSleepDuration} targetTime={targetTime} onNext={completeOnboarding} />;
            default: return null;
        }
    };

    return (
        <div className="onboarding-screen">
            {step > 1 && (
                <button className="back-button" onClick={prevStep}></button>
            )}

            <div className="step-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                {renderStep()}
            </div>
        </div>
    );
};

// Step 1: Welcome
const Step1Welcome = ({ onNext }) => (
    <div className="step-content fade-in">
        <div className="image-wrapper" style={{ marginBottom: '20px' }}>
            <img src={morningStretchImg} alt="아침 스트레칭" style={{ width: '100%', borderRadius: '24px', maxHeight: '360px', objectFit: 'cover' }} />
        </div>
        <h2 className="step-title" style={{ fontSize: '24px', marginBottom: '16px' }}>
            보통 사람들은,<br />
            아침 8시에 눈을 뜹니다
        </h2>
        <p className="step-subtitle" style={{ fontSize: '16px', lineHeight: '1.6' }}>
            하지만 어떤 사람들은,<br />
            <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>오전 6시에 이미 꿈을 향해</span><br />
            두 시간을 먼저 달려가고 있어요
        </p>
        <div style={{ marginTop: 'auto', width: '100%' }}>
            <div className="progress-dots">
                <span className="dot active"></span>
                {[...Array(5)].map((_, i) => <span key={i} className="dot"></span>)}

            </div>
            <button className="btn-primary" onClick={onNext}>시작하기</button>
        </div>
    </div>
);

// Step 2: Current Time
const Step2CurrentTime = ({ time, setTime, onNext }) => {
    return (
        <div className="step-content fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="step-title">먼저 물어볼게요<br />요즘 몇 시쯤 일어나나요?</h2>

            <div className="time-card">
                <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '24px' }}>⏰</div>
                <TimePicker24h time={time} setTime={setTime} />
            </div>

            <div style={{ marginTop: 'auto', width: '100%' }}>
                <div className="progress-dots">
                    <span className="dot"></span>
                    <span className="dot active"></span>
                    {[...Array(4)].map((_, i) => <span key={i} className="dot"></span>)}

                </div>
                <button className="btn-primary" onClick={onNext}>다음으로</button>
            </div>
        </div>
    );
};

// Step 3: Target Time
const Step3TargetTime = ({ target, current, setTime, onNext }) => {
    // Calculate difference logic
    const currentStr = `${current.hours}:${current.minutes}`;
    const targetStr = `${target.hours}:${target.minutes}`;
    const { hours, minutes } = calculateTimeDifference(currentStr, targetStr);

    return (
        <div className="step-content fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="step-title">그럼<br />몇 시에 일어나고 싶으신가요?</h2>

            <div className="time-card">
                <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '24px' }}>⏰</div>
                <TimePicker24h time={target} setTime={setTime} />
            </div>

            <div className="time-difference-card">
                <p className="time-difference-text">
                    매일 <span className="time-difference-highlight">
                        {hours > 0 && `${hours}시간`} {minutes > 0 && `${minutes}분`}
                    </span>을<br />
                    먼저 시작하게 됩니다
                </p>
            </div>

            <div style={{ marginTop: 'auto', width: '100%' }}>
                <div className="progress-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot active"></span>
                    {[...Array(3)].map((_, i) => <span key={i} className="dot"></span>)}

                </div>
                <button className="btn-primary" onClick={onNext}>다음으로</button>
            </div>
        </div>
    );
};

// Step 4: Goal
const Step4Goal = ({ goal, setGoal, onNext }) => {
    const suggestions = [
        "독서와 명상으로 하루를 준비하고 싶어요",
        "운동으로 건강한 하루를 시작하고 싶어요",
        "나만의 프로젝트에 집중하고 싶어요"
    ];

    return (
        <div className="step-content fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="step-title">이 시간으로 무엇을<br />하고 싶으신가요?</h2>

            <textarea
                className="goal-textarea"
                placeholder="목표를 입력하세요..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                maxLength={100}
            />
            <div className="char-counter" style={{ width: '100%', textAlign: 'right' }}>{goal.length} / 100</div>

            <div className="suggestion-chips" style={{ width: '100%' }}>
                {suggestions.map((s, i) => (
                    <div key={i} className="suggestion-chip" onClick={() => setGoal(s)}>
                        {s}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 'auto', width: '100%' }}>
                <div className="progress-dots">
                    {[...Array(3)].map((_, i) => <span key={i} className="dot"></span>)}
                    <span className="dot active"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>

                </div>
                <button className="btn-primary" onClick={onNext} disabled={!goal}>다음으로</button>
            </div>
        </div>
    );
};

// Step 5: Resolution (New)
const Step5Resolution = ({ resolution, setResolution, onNext }) => {
    const presets = [
        "작은 성취가 쌓여, 더 단단한 나를 만들 거야.",
        "나와의 약속을 지키며, 나를 믿는 힘을 기른다.",
        "고요한 새벽, 오롯이 나에게 집중한다.",
        "비교하지 않고, 묵묵히 나의 길을 걷는다."
    ];

    return (
        <div className="step-content fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="step-title" style={{ whiteSpace: 'pre-line' }}>
                새벽은 누구에게나 오지만,{'\n'}기회는 깨어있는 자에게만 옵니다.
            </h2>
            <p className="step-subtitle" style={{ whiteSpace: 'pre-line' }}>
                매일 아침, 어떤 마음으로 눈을 뜨시겠습니까?{'\n'}당신을 일으켜 세울 한 문장을 정해주세요.
            </p>

            <div style={{ width: '100%', marginBottom: '20px', marginTop: '20px' }}>
                <input
                    type="text"
                    placeholder="예: 작은 성취를 쌓아, 더 단단한 나를 만든다."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    maxLength={30}
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        border: `2px solid ${resolution ? 'var(--color-primary)' : '#E8E4F3'}`,
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s'
                    }}
                />
                <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {resolution.length}/30
                </div>
            </div>

            <div className="suggestion-chips" style={{ width: '100%' }}>
                {presets.map((text, i) => (
                    <div
                        key={i}
                        className="suggestion-chip"
                        onClick={() => setResolution(text)}
                        style={{ fontSize: '14px', padding: '14px', background: 'white', border: '1px solid #E8E4F3', borderRadius: '12px', marginBottom: '8px', cursor: 'pointer', textAlign: 'left' }}
                    >
                        {text}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 'auto', width: '100%' }}>
                <div className="progress-dots">
                    {[...Array(4)].map((_, i) => <span key={i} className="dot"></span>)}
                    <span className="dot active"></span>
                    <span className="dot"></span>
                </div>
                <button className="btn-primary" onClick={onNext} disabled={!resolution.trim()}>다음으로</button>
            </div>
        </div>
    );
};

// Step 6: Sleep
const Step6Sleep = ({ duration, setDuration, targetTime, onNext }) => {
    const sleepOptions = [5.5, 6, 6.5, 7, 7.5, 8];
    const { bedtime, relaxTime } = calculateBedtime(
        `${targetTime.hours}:${targetTime.minutes}`,
        duration
    );

    return (
        <div className="step-content fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="step-title">충분한 수면이<br />빛나는 아침의 시작입니다</h2>

            <div className="sleep-chips">
                {sleepOptions.map(h => (
                    <div
                        key={h}
                        className={`sleep-chip ${duration === h ? 'selected' : ''}`}
                        onClick={() => setDuration(h)}
                    >
                        {h}시간
                    </div>
                ))}
            </div>

            <div className="bedtime-card" style={{ width: '100%' }}>
                <div className="bedtime-icon">🌙</div>
                <div className="bedtime-label">권장 취침 시간</div>
                <div className="bedtime-time">{bedtime}</div>
                <div className="bedtime-hint">💡 {relaxTime.split(' ')[0]}부터 휴식을 시작하세요</div>
            </div>

            <div style={{ marginTop: 'auto', width: '100%' }}>
                <div className="progress-dots">
                    {[...Array(5)].map((_, i) => <span key={i} className="dot"></span>)}
                    <span className="dot active"></span>

                </div>
                <button className="btn-primary" onClick={onNext}>시작하기</button>
            </div>
        </div>
    );
};

// Styles for Onboarding
const styles = `
.onboarding-screen {
    background: linear-gradient(180deg, #F8F7FC 0%, #E8E4F3 100%);
    min-height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
}
.back-button {
    width: 40px; height: 40px; background: white; border-radius: 12px;
    border: none; cursor: pointer; margin-bottom: 12px;
    display: flex; align-items: center; justify-content: center;
}
.back-button::before { content: '←'; font-size: 20px; color: var(--color-primary); }
.progress-dots { display: flex; gap: 8px; justify-content: center; margin-bottom: 16px; align-items: center; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(139, 127, 220, 0.2); transition: all 0.3s; }
.dot.active { width: 24px; border-radius: 4px; background: var(--color-primary); }

.time-card { background: white; border: 2px solid var(--color-primary); border-radius: 24px; padding: 24px 20px; margin: 20px 0; width: 100%; }

/* New Time Picker Styles */
.time-picker-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
}
.time-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}
.time-display {
    width: 100px;
    height: 80px;
    font-size: 64px;
    font-family: 'Roboto', 'Inter', sans-serif;
    font-weight: 500;
    text-align: center;
    color: var(--color-text-primary);
    background: #F8F7FC;
    border-radius: 16px;
    line-height: 80px;
}
.time-control-btn {
    width: 100%;
    background: none;
    border: none;
    color: var(--color-primary);
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    transition: all 0.2s;
    opacity: 0.6;
}
.time-control-btn:hover {
    opacity: 1;
    transform: scale(1.1);
}
.time-separator { font-size: 40px; font-weight: 500; color: var(--color-text-secondary); margin-top: 0; }

.goal-textarea { width: 100%; height: 100px; padding: 16px; border: 2px solid var(--color-primary); border-radius: 16px; resize: none; margin-top: 20px; }
.suggestion-chips { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
.suggestion-chip { padding: 14px 16px; background: white; border: 2px solid #E8E4F3; border-radius: 12px; cursor: pointer; text-align: left; font-size: 14px; }
.theme-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
.theme-card { background: white; border: 2px solid #E8E4F3; border-radius: 16px; padding: 16px; text-align: center; cursor: pointer; }
.theme-card.selected { border-color: var(--color-primary); background: rgba(139, 127, 220, 0.1); }
.theme-emoji { font-size: 32px; margin-bottom: 8px; }
.sleep-chips { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px; margin-top: 24px; width: 100%; }
.sleep-chip { padding: 12px 0; background: white; border: 2px solid #E8E4F3; border-radius: 16px; cursor: pointer; text-align: center; font-weight: 500; transition: all 0.2s; font-size: 14px; }
.sleep-chip:hover { border-color: var(--color-primary); background: #F8F7FC; }
.sleep-chip.selected { background: var(--color-primary); color: white; border-color: var(--color-primary); font-weight: 700; box-shadow: 0 4px 12px rgba(139, 127, 220, 0.3); }
.bedtime-card { background: rgba(139, 127, 220, 0.1); border-radius: 20px; padding: 24px; text-align: center; }
.bedtime-time { font-size: 36px; font-weight: 700; color: var(--color-primary); margin: 16px 0; }
.bedtime-hint { font-size: 14px; }
.fade-in { animation: fadeIn 0.5s ease; flex: 1; display: flex; flex-direction: column; }
`;

// Append styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Onboarding;
