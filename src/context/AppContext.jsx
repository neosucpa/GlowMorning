import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateStreak } from '../utils/statsUtils';
import { getTodayStr } from '../utils/dateUtils';

const AppContext = createContext();

const INITIAL_USER_DATA = {
    currentWakeTime: '07:00 AM',
    targetWakeTime: '05:30 AM',
    timeDifference: 1.5,
    goal: '',
    resolution: '',
    sleepDuration: 7,
    onboardingCompleted: false,
    completedAt: null,
    username: '',
    // Settings
    alarmEnabled: true,
    excludeWeekends: false,
    notifications: {
        recordReminder: {
            enabled: false,
            time: '21:00'
        },
        sleepReminder: {
            enabled: false,
            minutesBefore: 60 // 1시간 전
        }
    }
};

const INITIAL_APP_STATE = {
    currentScreen: 'splash',
    currentDate: new Date().toISOString().split('T')[0],
    currentTime: new Date().toLocaleTimeString('ko-KR'),
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    records: {},
    currentStreak: 0,
    totalDays: 0,
    savedTime: 0
};

export const AppProvider = ({ children }) => {
    // DEV: Clear storage on every load as requested
    // Remove this line in production
    // localStorage.clear();

    // Load from LocalStorage or use defaults
    const [userData, setUserData] = useState(() => {
        try {
            const saved = localStorage.getItem('glowmorning_user');
            return saved ? { ...INITIAL_USER_DATA, ...JSON.parse(saved) } : INITIAL_USER_DATA;
        } catch (e) {
            console.error("Failed to load user data", e);
            return INITIAL_USER_DATA;
        }
    });

    const [appState, setAppState] = useState(() => {
        try {
            const saved = localStorage.getItem('glowmorning_app_state');
            return saved ? JSON.parse(saved) : INITIAL_APP_STATE;
        } catch (e) {
            console.error("Failed to load app state", e);
            return INITIAL_APP_STATE;
        }
    });

    // Save to LocalStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('glowmorning_user', JSON.stringify(userData));
    }, [userData]);

    useEffect(() => {
        localStorage.setItem('glowmorning_app_state', JSON.stringify(appState));
    }, [appState]);

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setAppState(prev => ({
                ...prev,
                currentTime: new Date().toLocaleTimeString('ko-KR')
            }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Helper to update user data
    const updateUserData = (newData) => {
        setUserData(prev => ({ ...prev, ...newData }));
    };

    // Helper to update app state
    const updateAppState = (newData) => {
        setAppState(prev => ({ ...prev, ...newData }));
    };



    // Helper to update records
    const updateRecord = (date, data) => {
        try {
            setAppState(prev => {
                const newRecords = { ...prev.records };
                newRecords[date] = { ...(newRecords[date] || {}), ...data };

                // Recalculate stats
                const totalDays = Object.values(newRecords).filter(r => r.wake).length;
                const currentStreak = calculateStreak(newRecords, getTodayStr(), userData.excludeWeekends || false);

                return {
                    ...prev,
                    records: newRecords,
                    totalDays,
                    currentStreak
                };
            });
        } catch (error) {
            console.error('Error updating record:', error);
            // Re-throw to let caller handle it
            throw error;
        }
    };

    const value = {
        userData,
        appState,
        updateUserData,
        updateAppState,
        updateRecord
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
