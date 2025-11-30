import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../index.css';

const Pledge = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userData, updateUserData } = useApp();

    // Check if we are in "view mode" (from settings)
    const isViewMode = location.state?.viewMode || false;

    // State for name input
    const [name, setName] = useState(userData.username || '');

    // Get today's date formatted
    const today = new Date();
    const dateStr = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}.`;

    const handleConfirm = () => {
        if (!name.trim() && !isViewMode) {
            alert('이름을 입력해주세요.');
            return;
        }

        if (!isViewMode) {
            updateUserData({
                username: name,
                pledgeSigned: true,
                signedAt: new Date().toISOString()
            });
            navigate('/dashboard', { state: { showWelcome: true } });
        } else {
            navigate(-1); // Go back
        }
    };

    return (
        <div className="pledge-screen fade-in">
            <div className="pledge-paper">
                <div className="pledge-header">
                    <div className="pledge-icon">🍃</div>
                    <h1 className="pledge-title">나의 작은 약속</h1>
                    <div className="pledge-divider"></div>
                </div>

                <p className="pledge-statement">나는 다음과 같이 다짐합니다.</p>

                <div className="pledge-content">
                    <div className="pledge-section">
                        <div className="pledge-label">기상 시간</div>
                        <div className="pledge-time">{userData.targetWakeTime || '05:00 AM'}</div>
                        <div className="pledge-subtext">매일 이 시간에 일어나겠습니다</div>
                    </div>

                    <div className="pledge-section">
                        <div className="pledge-label">새벽 기상으로 이루고 싶은 것</div>
                        <div className="pledge-value">"{userData.goal || '건강한 몸과 마음을 만들고, 자기계발 시간 확보'}"</div>
                    </div>

                    <div className="pledge-section">
                        <div className="pledge-label">나의 다짐</div>
                        <div className="pledge-value">"{userData.resolution || '작은 성취를 쌓아, 더 단단한 나를 만든다'}"</div>
                    </div>

                    <div className="pledge-promise">
                        <div className="pledge-promise-title">앞으로 <span className="highlight">30일 동안</span></div>
                        <div className="pledge-promise-text">이 약속을 지키기 위해 노력하겠습니다.</div>
                    </div>

                    <div className="pledge-box">
                        <div className="pledge-box-title">스스로에게 하는 약속</div>
                        <ul className="pledge-list">
                            <li>완벽하지 않아도 괜찮습니다</li>
                            <li>넘어져도 다시 일어나겠습니다</li>
                            <li>작은 성공도 축하하겠습니다</li>
                            <li>나 자신을 믿겠습니다</li>
                        </ul>
                    </div>
                </div>

                <div className="pledge-footer">
                    <div className="pledge-date">
                        <div className="label">Date</div>
                        <div className="value">{dateStr}</div>
                    </div>
                    <div className="pledge-signature">
                        <div className="label">Signature</div>
                        <div className="signature-area">
                            {isViewMode ? (
                                <div className="signature-text">{userData.username}</div>
                            ) : (
                                <input
                                    type="text"
                                    className="signature-input"
                                    placeholder="이름을 입력하세요"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength={10}
                                />
                            )}
                        </div>
                        <div className="signature-line"></div>
                    </div>
                </div>

                <button className="btn-primary pledge-btn" onClick={handleConfirm}>
                    {isViewMode ? '닫기' : '서명하기'}
                </button>
            </div>
        </div>
    );
};

// Add styles locally or to index.css. 
const styles = `
.pledge-screen {
    background: #FDFBF7; /* Creamy background */
    min-height: 100vh;
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.pledge-paper {
    background: #FFF9E5; /* Light yellow paper */
    border: 2px solid #2D2A3E;
    padding: 32px 24px;
    width: 100%;
    max-width: 400px;
    position: relative;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}
.pledge-header { text-align: center; margin-bottom: 20px; }
.pledge-icon { font-size: 32px; margin-bottom: 12px; }
.pledge-title { font-family: 'KoPub Batang', serif; font-size: 24px; font-weight: 700; color: #2D2A3E; margin-bottom: 12px; }
.pledge-divider { width: 40px; height: 2px; background: #2D2A3E; margin: 0 auto; }
.pledge-statement { text-align: center; font-family: 'KoPub Batang', serif; font-size: 15px; color: #555; margin-bottom: 24px; }
.pledge-section { margin-bottom: 16px; text-align: center; }
.pledge-label { font-size: 12px; color: #888; margin-bottom: 6px; }
.pledge-time { font-family: 'KoPub Batang', serif; font-size: 28px; font-weight: 700; color: #2D2A3E; }
.pledge-subtext { font-size: 12px; color: #888; margin-top: 4px; }
.pledge-value { font-family: 'KoPub Batang', serif; font-size: 15px; color: #2D2A3E; line-height: 1.4; font-style: italic; }
.pledge-promise { text-align: center; margin: 24px 0; }
.pledge-promise-title { font-family: 'KoPub Batang', serif; font-size: 15px; margin-bottom: 6px; }
.highlight { font-weight: 700; text-decoration: underline; }
.pledge-promise-text { font-family: 'KoPub Batang', serif; font-size: 15px; color: #555; }
.pledge-box { background: #F8F9FA; border: 1px solid #E8E4F3; padding: 16px; margin-bottom: 24px; }
.pledge-box-title { font-size: 13px; font-weight: 700; text-align: center; margin-bottom: 12px; color: #2D2A3E; }
.pledge-list { list-style: none; padding: 0; }
.pledge-list li { font-size: 13px; color: #666; margin-bottom: 6px; position: relative; padding-left: 14px; }
.pledge-list li::before { content: '-'; position: absolute; left: 0; }
.pledge-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
.pledge-date .label, .pledge-signature .label { font-size: 11px; color: #888; margin-bottom: 4px; }
.pledge-date .value { font-family: 'KoPub Batang', serif; font-size: 15px; font-weight: 700; }
.pledge-signature { text-align: right; }
.signature-area { position: relative; height: 40px; width: 150px; display: flex; align-items: flex-end; justify-content: flex-end; }
.signature-input { 
    width: 100%; 
    border: none; 
    background: transparent; 
    text-align: right; 
    font-family: 'Nanum Pen Script', cursive; /* Handwriting style font */
    font-size: 32px; 
    color: #2D2A3E;
    outline: none;
    padding: 0;
}
.signature-text {
    font-family: 'Nanum Pen Script', cursive;
    font-size: 32px;
    color: #2D2A3E;
}
.signature-input::placeholder { color: #DDD; font-size: 16px; }
.signature-line { width: 150px; height: 1px; background: #2D2A3E; margin-top: 4px; }
.pledge-btn { background: #2D2A3E; color: white; border-radius: 0; width: 100%; }
.pledge-btn:hover { background: #444; }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Pledge;
