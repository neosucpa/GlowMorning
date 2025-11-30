import React from 'react';

const ToggleSwitch = ({ enabled, onToggle, label, disabled = false }) => {
    return (
        <div className="toggle-switch-container">
            {label && <span className="toggle-label">{label}</span>}
            <div
                className={`toggle-switch ${enabled ? 'enabled' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && onToggle(!enabled)}
                role="switch"
                aria-checked={enabled}
                tabIndex={disabled ? -1 : 0}
            >
                <div className="toggle-slider"></div>
            </div>

            <style>{`
                .toggle-switch-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .toggle-label {
                    font-size: 15px;
                    color: var(--color-text-primary);
                }
                .toggle-switch {
                    width: 48px;
                    height: 28px;
                    background: #E0E0E0;
                    border-radius: 14px;
                    position: relative;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }
                .toggle-switch.enabled {
                    background: var(--color-primary);
                }
                .toggle-switch.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .toggle-slider {
                    width: 24px;
                    height: 24px;
                    background: white;
                    border-radius: 50%;
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    transition: transform 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .toggle-switch.enabled .toggle-slider {
                    transform: translateX(20px);
                }
            `}</style>
        </div>
    );
};

export default ToggleSwitch;
