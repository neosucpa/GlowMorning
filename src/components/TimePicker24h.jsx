import React from 'react';
import '../index.css';

const TimePicker24h = ({ time, setTime }) => {
    const updateTime = (type, delta) => {
        let val = parseInt(time[type]);
        if (type === 'hours') {
            val = (val + delta + 24) % 24;
        } else {
            val = (val + delta + 60) % 60;
        }
        setTime(prev => ({ ...prev, [type]: val.toString().padStart(2, '0') }));
    };

    return (
        <div className="time-picker-container">
            {/* Hours Column */}
            <div className="time-column">
                <button className="time-control-btn up" onClick={() => updateTime('hours', 1)}>▲</button>
                <div className="time-display">{time.hours}</div>
                <button className="time-control-btn down" onClick={() => updateTime('hours', -1)}>▼</button>
            </div>

            <div className="time-separator">:</div>

            {/* Minutes Column */}
            <div className="time-column">
                <button className="time-control-btn up" onClick={() => updateTime('minutes', 5)}>▲</button>
                <div className="time-display">{time.minutes}</div>
                <button className="time-control-btn down" onClick={() => updateTime('minutes', -5)}>▼</button>
            </div>
        </div>
    );
};

export default TimePicker24h;
