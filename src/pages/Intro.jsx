import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import glowmorningLogo from '../assets/glowmorning.png';
import splashBg from '../assets/splash_bg.png';
import '../index.css';

const Intro = () => {
    const navigate = useNavigate();
    const { userData } = useApp();

    useEffect(() => {
        // Check if user has already completed onboarding
        // We add a small delay for the splash effect
        const timer = setTimeout(() => {
            if (userData.onboardingCompleted) {
                navigate('/dashboard');
            }
        }, 3000); // Wait 3 seconds if auto-redirecting, but spec says wait for click for new users

        return () => clearTimeout(timer);
    }, [userData, navigate]);

    const handleStart = () => {
        if (userData.onboardingCompleted) {
            navigate('/dashboard');
        } else {
            navigate('/onboarding');
        }
    };

    return (
        <div className="splash-screen">
            <div className="splash-background-wrapper">
                <img src={splashBg} alt="Background" className="splash-bg-image" />
                <div className="splash-overlay"></div>
            </div>

            <div className="splash-content">
                <img src={glowmorningLogo} alt="GlowMorning" className="splash-logo-img" />

                <div className="splash-bottom-content">
                    <p className="splash-tagline">빛나는 아침을 시작하세요</p>

                    <div className="splash-arrow" onClick={handleStart}>
                        시작하기
                    </div>
                </div>
            </div>

            <style>{`
                .splash-screen {
                    position: relative;
                    width: 100%;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                
                .splash-background-wrapper {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                }

                .splash-bg-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .splash-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%);
                }

                .splash-content {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .splash-logo-img {
                    width: 240px;
                    height: auto;
                    margin-bottom: 40px; /* Adjust spacing */
                    animation: fadeInUp 0.8s ease;
                }

                .splash-bottom-content {
                    position: absolute;
                    bottom: 120px; /* Move down as requested */
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    animation: fadeIn 1s ease 0.3s both;
                }

                .splash-tagline {
                    font-size: 16px;
                    font-weight: 400;
                    color: white;
                    opacity: 0.9;
                    margin-bottom: 24px;
                    text-align: center;
                }

                .splash-arrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 16px;
                    text-decoration: none;
                    color: white;
                    border-bottom: 2px solid white;
                    padding-bottom: 4px;
                    cursor: pointer;
                }

                .splash-arrow::after {
                    content: '→';
                    animation: arrowFloat 1.5s ease-in-out infinite;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes arrowFloat {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(8px); }
                }
            `}</style>
        </div>
    );
};

export default Intro;
