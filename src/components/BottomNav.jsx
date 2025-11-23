import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../index.css';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { id: 'home', icon: '🏠', label: '홈', path: '/dashboard' },
        { id: 'record', icon: '📝', label: '기록', path: '/records' }, // Placeholder path
        { id: 'stats', icon: '📊', label: '통계', path: '/stats' }, // Placeholder path
        { id: 'challenge', icon: '🏆', label: '챌린지', path: '/challenge' }, // Placeholder path
        { id: 'settings', icon: '⚙️', label: '설정', path: '/settings' }, // Placeholder path
    ];

    return (
        <div className="bottom-nav">
            {navItems.map(item => (
                <div
                    key={item.id}
                    className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
                    onClick={() => navigate(item.path)}
                >
                    <div className="nav-icon">{item.icon}</div>
                    <div className="nav-label">{item.label}</div>
                </div>
            ))}

            <style>{`
                .bottom-nav {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: white;
                    border-top: 1px solid #E8E4F3;
                    padding: 12px 0;
                    padding-bottom: calc(12px + var(--safe-area-bottom));
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    box-shadow: 0 -2px 12px rgba(139, 127, 220, 0.08);
                    z-index: 100;
                    max-width: 480px; /* Match app container max-width */
                    margin: 0 auto;
                }
                .nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    cursor: pointer;
                    transition: all 300ms ease;
                    padding: 8px 0;
                }
                .nav-icon { font-size: 24px; transition: all 300ms ease; }
                .nav-label { font-size: 11px; font-weight: 500; color: var(--color-text-secondary); transition: all 300ms ease; }
                .nav-item.active .nav-icon { transform: scale(1.1); }
                .nav-item.active .nav-label { color: var(--color-primary); font-weight: 600; }
                .nav-item:not(.active) { opacity: 0.6; }
                .nav-item:hover { opacity: 1; }
            `}</style>
        </div>
    );
};

export default BottomNav;
