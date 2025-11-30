export const timeToMinutes = (timeStr) => {
    // "07:00" (24h) -> minutes
    if (!timeStr) return 0;

    // Check if it has AM/PM (legacy support if needed, but we are switching to 24h)
    if (timeStr.includes(' ')) {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    }

    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

export const minutesToTime = (totalMinutes) => {
    // minutes -> "19:00" (24h)
    let hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Normalize hours to 0-23
    hours = hours % 24;
    if (hours < 0) hours += 24;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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
    // Use local time for date string
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
