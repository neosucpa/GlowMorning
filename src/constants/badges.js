export const BADGE_GROUPS = {
    BEGINNING: { id: 'BEGINNING', name: '시작의 발걸음 (누적)' },
    CONSISTENCY: { id: 'CONSISTENCY', name: '꾸준함의 미학 (연속)' },
    EARLY_BIRD: { id: 'EARLY_BIRD', name: '새벽을 여는 자 (시간)' },
    ARCHIVIST: { id: 'ARCHIVIST', name: '기록의 힘 (수집)' }
};

export const BADGES = [
    // Group 1: Beginning (Total Count)
    {
        id: 'FIRST_STEP',
        group: 'BEGINNING',
        tier: 1,
        name: '첫 걸음',
        description: '첫 번째 오늘의 기록을 남겨보세요.',
        condition: { type: 'count', count: 1 },
        icon: '🌱'
    },
    {
        id: 'ONE_WEEK_TOTAL',
        group: 'BEGINNING',
        tier: 1,
        name: '일주일의 누적',
        description: '총 7번의 오늘을 기록하세요.',
        condition: { type: 'count', count: 7 },
        icon: '🧱'
    },
    {
        id: 'TWO_WEEKS_TOTAL',
        group: 'BEGINNING',
        tier: 2,
        name: '이주의 누적',
        description: '총 14번의 오늘을 기록하세요.',
        condition: { type: 'count', count: 14 },
        icon: '🏗️'
    },
    {
        id: 'FIRST_MONTH_TOTAL',
        group: 'BEGINNING',
        tier: 2,
        name: '한 달의 여정',
        description: '총 30번의 오늘을 기록하세요.',
        condition: { type: 'count', count: 30 },
        icon: '🗓️'
    },
    {
        id: 'FIFTY_DAYS_TOTAL',
        group: 'BEGINNING',
        tier: 3,
        name: '50일의 기록',
        description: '총 50번의 오늘을 기록하세요.',
        condition: { type: 'count', count: 50 },
        icon: '📝'
    },
    {
        id: 'HUNDRED_DAYS_TOTAL',
        group: 'BEGINNING',
        tier: 3,
        name: '100일의 끈기',
        description: '총 100번의 오늘을 기록하세요.',
        condition: { type: 'count', count: 100 },
        icon: '💯'
    },
    {
        id: 'YEAR_OF_MORNINGS',
        group: 'BEGINNING',
        tier: 3,
        name: '1년의 아침',
        description: '총 365번의 오늘을 기록하세요.',
        condition: { type: 'count', count: 365 },
        icon: '🌏'
    },

    // Group 2: Consistency (Streak)
    {
        id: 'THREE_DAY_STREAK',
        group: 'CONSISTENCY',
        tier: 1,
        name: '작심삼일 극복',
        description: '3일 연속으로 오늘을 기록하세요.',
        condition: { type: 'streak', count: 3 },
        icon: '🐣'
    },
    {
        id: 'WEEKLY_STREAK',
        group: 'CONSISTENCY',
        tier: 1,
        name: '일주일의 리듬',
        description: '7일 연속으로 오늘을 기록하세요.',
        condition: { type: 'streak', count: 7 },
        icon: '🎵'
    },
    {
        id: 'TWO_WEEK_STREAK',
        group: 'CONSISTENCY',
        tier: 2,
        name: '이주의 몰입',
        description: '14일 연속으로 오늘을 기록하세요.',
        condition: { type: 'streak', count: 14 },
        icon: '🔥'
    },
    {
        id: 'MONTHLY_STREAK',
        group: 'CONSISTENCY',
        tier: 2,
        name: '한 달의 완성',
        description: '30일 연속으로 오늘을 기록하세요.',
        condition: { type: 'streak', count: 30 },
        icon: '👑'
    },
    {
        id: 'HABIT_FORMED',
        group: 'CONSISTENCY',
        tier: 3,
        name: '습관의 형성',
        description: '66일 연속으로 오늘을 기록하세요.',
        condition: { type: 'streak', count: 66 },
        icon: '🧠'
    },
    {
        id: 'HUNDRED_DAY_STREAK',
        group: 'CONSISTENCY',
        tier: 3,
        name: '100일의 기적',
        description: '100일 연속으로 오늘을 기록하세요.',
        condition: { type: 'streak', count: 100 },
        icon: '🦄'
    },
    {
        id: 'YEAR_STREAK',
        group: 'CONSISTENCY',
        tier: 3,
        name: '전설의 시작',
        description: '365일 연속으로 오늘을 기록하세요.',
        condition: { type: 'streak', count: 365 },
        icon: '🏆'
    },

    // Group 3: Early Bird (Time)
    {
        id: 'GOOD_START',
        group: 'EARLY_BIRD',
        tier: 1,
        name: '상쾌한 시작',
        description: '오전 8시 이전에 5번 기상하세요.',
        condition: { type: 'time_count', time: 8, count: 5 },
        icon: '🌤️'
    },
    {
        id: 'EARLY_START',
        group: 'EARLY_BIRD',
        tier: 1,
        name: '부지런한 아침',
        description: '오전 7시 이전에 5번 기상하세요.',
        condition: { type: 'time_count', time: 7, count: 5 },
        icon: '⏰'
    },
    {
        id: 'SUNRISE_CHASER',
        group: 'EARLY_BIRD',
        tier: 2,
        name: '일출 추적자',
        description: '오전 6시 이전에 10번 기상하세요.',
        condition: { type: 'time_count', time: 6, count: 10 },
        icon: '🌅'
    },
    {
        id: 'MORNING_PERSON',
        group: 'EARLY_BIRD',
        tier: 2,
        name: '아침형 인간',
        description: '오전 6시 이전에 30번 기상하세요.',
        condition: { type: 'time_count', time: 6, count: 30 },
        icon: '🏃'
    },
    {
        id: 'MIRACLE_MORNING',
        group: 'EARLY_BIRD',
        tier: 3,
        name: '미라클 모닝',
        description: '오전 5시 이전에 10번 기상하세요.',
        condition: { type: 'time_count', time: 5, count: 10 },
        icon: '✨'
    },
    {
        id: '5AM_CLUB',
        group: 'EARLY_BIRD',
        tier: 3,
        name: '5AM 클럽',
        description: '오전 5시 이전에 30번 기상하세요.',
        condition: { type: 'time_count', time: 5, count: 30 },
        icon: '🧘'
    },
    {
        id: 'MASTER_OF_DAWN',
        group: 'EARLY_BIRD',
        tier: 3,
        name: '새벽의 지배자',
        description: '오전 6시 이전에 100번 기상하세요.',
        condition: { type: 'time_count', time: 6, count: 100 },
        icon: '🧙‍♂️'
    },

    // Group 4: Archivist (Records)
    {
        id: 'MEMORY_COLLECTOR',
        group: 'ARCHIVIST',
        tier: 1,
        name: '추억 수집가',
        description: '사진이 포함된 기록을 10개 남기세요.',
        condition: { type: 'photo_count', count: 10 },
        icon: '📸'
    },
    {
        id: 'STORYTELLER',
        group: 'ARCHIVIST',
        tier: 1,
        name: '이야기꾼',
        description: '글이 포함된 기록을 10개 남기세요.',
        condition: { type: 'note_count', count: 10 },
        icon: '✍️'
    },
    {
        id: 'PHOTO_ALBUM',
        group: 'ARCHIVIST',
        tier: 2,
        name: '나만의 앨범',
        description: '사진이 포함된 기록을 30개 남기세요.',
        condition: { type: 'photo_count', count: 30 },
        icon: '🖼️'
    },
    {
        id: 'ESSAYIST',
        group: 'ARCHIVIST',
        tier: 2,
        name: '에세이스트',
        description: '글이 포함된 기록을 30개 남기세요.',
        condition: { type: 'note_count', count: 30 },
        icon: '📖'
    },
    {
        id: 'VISUAL_DIARY',
        group: 'ARCHIVIST',
        tier: 3,
        name: '시각적 일기',
        description: '사진이 포함된 기록을 100개 남기세요.',
        condition: { type: 'photo_count', count: 100 },
        icon: '🎞️'
    },
    {
        id: 'NOVELIST',
        group: 'ARCHIVIST',
        tier: 3,
        name: '소설가',
        description: '글이 포함된 기록을 100개 남기세요.',
        condition: { type: 'note_count', count: 100 },
        icon: '📚'
    },
    {
        id: 'AUTOBIOGRAPHY',
        group: 'ARCHIVIST',
        tier: 3,
        name: '자서전',
        description: '글이 포함된 기록을 365개 남기세요.',
        condition: { type: 'note_count', count: 365 },
        icon: '🖋️'
    }
];
