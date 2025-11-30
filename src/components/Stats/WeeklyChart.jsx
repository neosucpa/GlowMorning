import React from 'react';

const WeeklyChart = ({ data }) => {
    // data: [{ day: 'Mon', wakeTime: 6.5, targetTime: 6.0, isSuccess: true }, ...]

    const maxTime = 10; // Chart cap at 10:00 AM
    const minTime = 4;  // Chart floor at 4:00 AM
    const range = maxTime - minTime;

    const getHeight = (time) => {
        if (!time) return 0;
        // Invert: earlier is higher
        const normalized = Math.max(minTime, Math.min(time, maxTime));
        return ((maxTime - normalized) / range) * 100;
    };

    return (
        <div className="stats-card">
            <h3 className="card-title">이번 주 리듬</h3>
            <div className="chart-container">
                {data.map((d, i) => (
                    <div key={i} className="chart-col">
                        <div className="bar-container">
                            {d.wakeTime && (
                                <div
                                    className={`bar ${d.isSuccess ? 'success' : 'fail'}`}
                                    style={{ height: `${getHeight(d.wakeTime)}%` }}
                                >
                                    <span className="bar-label">
                                        {Math.floor(d.wakeTime)}:{(Math.round((d.wakeTime % 1) * 60)).toString().padStart(2, '0')}
                                    </span>
                                </div>
                            )}
                            <div className="target-line" style={{ bottom: `${getHeight(d.targetTime)}%` }}></div>
                        </div>
                        <div className="day-label">{d.day}</div>
                    </div>
                ))}
            </div>
            <style>{`
                .card-title {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 24px;
                    color: #2D2A3E;
                }
                .chart-container {
                    display: flex;
                    justify-content: space-between;
                    height: 150px;
                    align-items: flex-end;
                    padding-top: 20px;
                }
                .chart-col {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                }
                .bar-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                }
                .bar {
                    width: 12px;
                    border-radius: 6px;
                    background: #E0E0E0;
                    position: relative;
                    transition: height 0.5s ease;
                }
                .bar.success {
                    background: #8B7FDC;
                }
                .bar.fail {
                    background: #FF9800;
                }
                .bar-label {
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 10px;
                    color: #666;
                    white-space: nowrap;
                }
                .target-line {
                    position: absolute;
                    width: 100%;
                    height: 1px;
                    background: rgba(0,0,0,0.1);
                    border-top: 1px dashed #ccc;
                    z-index: 0;
                }
                .day-label {
                    margin-top: 8px;
                    font-size: 12px;
                    color: #9E9E9E;
                }
            `}</style>
        </div>
    );
};

export default WeeklyChart;
