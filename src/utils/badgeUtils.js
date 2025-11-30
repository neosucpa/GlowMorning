import { calculateStreak } from './statsUtils';
import { getTodayStr } from './dateUtils';

export const calculateBadgeProgress = (records, badgeCondition) => {
    const todayStr = getTodayStr();
    let current = 0;
    const target = badgeCondition.count;
    let unlocked = false;

    const recordValues = Object.values(records || {});

    switch (badgeCondition.type) {
        case 'count':
            // Simple count of any valid record (wake is true)
            current = recordValues.filter(r => r.wake).length;
            break;

        case 'streak':
            // Use existing streak calculation
            // Note: calculateStreak returns current streak. 
            // If we want "max streak ever", we'd need more complex logic.
            // For now, let's use current streak or maybe we should store max streak in user data?
            // Assuming current streak for simplicity as per "Challenge" usually implies current effort,
            // but "Achievement" usually implies "ever done".
            // Let's stick to current streak for now, or simple max streak calculation if easy.
            // Actually, for "3 days streak", if I did it last week, I should have the badge.
            // But calculating "max streak ever" from raw records is O(N).
            // Let's implement a simple "max streak" calculator here.

            let maxStreak = 0;
            let tempStreak = 0;
            // Sort records by date
            const sortedDates = Object.keys(records || {}).sort();

            // This is a simplified max streak check. 
            // Real logic needs to check consecutive days.
            // Let's use a robust approach if possible, or just use current streak for MVP.
            // Given the user wants "Game Achievement" feel, "Once unlocked, always unlocked" is better.
            // So we need "Max Streak".

            if (sortedDates.length > 0) {
                let prevDate = null;
                sortedDates.forEach(dateStr => {
                    const record = records[dateStr];
                    if (record.wake) {
                        const currDate = new Date(dateStr);
                        if (prevDate) {
                            const diffTime = Math.abs(currDate - prevDate);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            if (diffDays === 1) {
                                tempStreak++;
                            } else {
                                tempStreak = 1;
                            }
                        } else {
                            tempStreak = 1;
                        }
                        if (tempStreak > maxStreak) maxStreak = tempStreak;
                        prevDate = currDate;
                    }
                });
            }
            current = maxStreak;
            break;

        case 'time_count':
            // Count days where wake time is before X hour
            current = recordValues.filter(r => {
                if (!r.wake || !r.wakeTime) return false;
                const wakeDate = new Date(r.wakeTime);
                return wakeDate.getHours() < badgeCondition.time;
            }).length;
            break;

        case 'photo_count':
            current = recordValues.filter(r => r.photoUrl).length;
            break;

        case 'note_count':
            current = recordValues.filter(r => r.morningNote && r.morningNote.trim().length > 0).length;
            break;

        default:
            current = 0;
    }

    // Cap current at target for display
    const displayCurrent = Math.min(current, target);
    const percent = Math.min(100, Math.round((current / target) * 100));
    unlocked = current >= target;

    return {
        current: displayCurrent,
        target,
        percent,
        unlocked
    };
};

export const calculateAllBadges = (records, badges) => {
    return badges.map(badge => {
        const progress = calculateBadgeProgress(records, badge.condition);
        return {
            ...badge,
            ...progress
        };
    });
};
