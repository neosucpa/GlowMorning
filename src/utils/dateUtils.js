export const timeToMinutes = (timeStr) => {
    // "07:00 AM" -> minutes
    if (!timeStr) return 0;

    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
};

export const minutesToTime = (totalMinutes) => {
    // minutes -> "07:00 AM"
    let hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';

    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export const calculateTimeDifference = (current, target) => {
    const currentMins = timeToMinutes(current);
    const targetMins = timeToMinutes(target);

    let diff = currentMins - targetMins;
    if (diff < 0) diff += 1440; // Next day

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return { hours, minutes, totalHours: diff / 60 };
};

export const calculateBedtime = (wakeTime, sleepHours) => {
    const wakeMins = timeToMinutes(wakeTime);
    const sleepMins = sleepHours * 60;

    let bedtimeMins = wakeMins - sleepMins;
    if (bedtimeMins < 0) bedtimeMins += 1440;

    let relaxMins = bedtimeMins - 60;
    if (relaxMins < 0) relaxMins += 1440;

    return {
        bedtime: minutesToTime(bedtimeMins),
        relaxTime: minutesToTime(relaxMins)
    };
};

export const getTodayStr = () => {
    return new Date().toISOString().split('T')[0];
};
