export const calculateStreak = (records, todayStr, excludeWeekends = false) => {
    if (!records) return 0;

    let streak = 0;
    const today = new Date(todayStr);

    // Check if today has a record (optional, depending on if we count today before it's over)
    // For this logic, we'll look backwards from yesterday or today if completed.

    // Simple approach: iterate backwards from today
    let currentCheckDate = new Date(today);

    // If today is not completed, start checking from yesterday
    // But if today IS completed, start from today.
    // We need to know if today is completed. 
    // Let's assume we pass the full records object.

    // Helper to format date as YYYY-MM-DD
    const formatDate = (date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    // Helper to check if date is weekend
    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6; // Sunday or Saturday
    };

    // Check up to 365 days back to avoid infinite loops
    for (let i = 0; i < 365; i++) {
        const dateStr = formatDate(currentCheckDate);
        const record = records[dateStr];

        // Skip weekends if excludeWeekends is true
        if (excludeWeekends && isWeekend(currentCheckDate)) {
            currentCheckDate.setDate(currentCheckDate.getDate() - 1);
            continue;
        }

        // A "streak" day is one where the user woke up (record.wake is true)
        // We might also require 'completed' (wake + note/photo) for a "perfect streak",
        // but usually just "showing up" (wake) counts for the streak in habit apps.
        // Let's stick to "wake" as the minimum requirement for the streak.

        if (record && record.wake) {
            streak++;
        } else {
            // If it's today and we haven't done it yet, don't break the streak from yesterday
            if (i === 0) {
                // If today is missing, we just ignore it for the count and continue to yesterday
                // UNLESS we want to show 0 if yesterday was missed too.
                // Let's look at yesterday.
            } else {
                break;
            }
        }

        // Move to previous day
        currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    }

    return streak;
};

export const getWeeklyData = (records, todayStr) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const data = [];
    const today = new Date(todayStr);

    // Get last 7 days (including today)
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);

        const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
        const record = records[dateStr];

        let wakeTime = null;
        if (record && record.wakeTime) {
            const wakeDate = new Date(record.wakeTime);
            // Convert to decimal hours for easier charting (e.g., 6:30 -> 6.5)
            wakeTime = wakeDate.getHours() + wakeDate.getMinutes() / 60;
        }

        data.push({
            day: days[d.getDay()],
            date: dateStr,
            wakeTime: wakeTime,
            isSuccess: record?.wake || false,
            targetTime: 6.0 // Default target 6:00 AM, could be dynamic later
        });
    }
    return data;
};

export const getBestDay = (records) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayStats = days.map(day => ({ day, count: 0 }));

    Object.values(records).forEach(record => {
        if (record.wake) {
            const date = new Date(record.dateStr || Object.keys(records).find(key => records[key] === record));
            if (!isNaN(date.getTime())) {
                const dayIndex = date.getDay();
                dayStats[dayIndex].count++;
            }
        }
    });

    // Find best day
    const maxCount = Math.max(...dayStats.map(d => d.count));
    const bestDays = dayStats.filter(d => d.count === maxCount && maxCount > 0).map(d => d.day);

    return bestDays.length > 0 ? bestDays.join(', ') : '-';
};

export const getDayOfWeekStats = (records) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];

    // Better approach: Pass the records object and iterate keys
    const dayStats = days.map(day => ({ day, count: 0 }));

    Object.entries(records).forEach(([dateStr, record]) => {
        if (record.wake) {
            const date = new Date(dateStr);
            const dayIndex = date.getDay();
            dayStats[dayIndex].count++;
        }
    });

    // Find best day
    const maxCount = Math.max(...dayStats.map(d => d.count));
    const bestDays = dayStats.filter(d => d.count === maxCount && maxCount > 0).map(d => d.day);

    return {
        chartData: dayStats,
        bestDays: bestDays.length > 0 ? bestDays : ['-']
    };
};

export const getMonthlySuccessRate = (records, year = new Date().getFullYear(), month = new Date().getMonth() + 1) => {
    // month is 1-12
    const prefix = `${year}-${month.toString().padStart(2, '0')}`;
    const daysInMonth = new Date(year, month, 0).getDate();

    let successCount = 0;

    Object.entries(records).forEach(([dateStr, record]) => {
        if (dateStr.startsWith(prefix) && record.wake) {
            successCount++;
        }
    });

    // Calculate percentage based on days passed so far if current month?
    // Or total days in month?
    // Usually "Consistency" implies "days I did it" / "days I could have done it".
    // Let's use "days passed so far" for current month, or total days for past months.

    const now = new Date();
    let totalDays = daysInMonth;

    if (now.getFullYear() === year && (now.getMonth() + 1) === month) {
        totalDays = now.getDate();
    }

    return totalDays > 0 ? Math.round((successCount / totalDays) * 100) : 0;
};
