export const CHAPTERS = [
    { id: 1, title: "작은 불씨", duration: 3, totalDays: 3, description: "작심삼일 돌파! 일단 3일만 버티면 첫 레벨업.", emoji: "🕯️" },
    { id: 2, title: "새벽의 틈", duration: 4, totalDays: 7, description: "일주일 달성. '나도 할 수 있다'는 자신감.", emoji: "🌥️" },
    { id: 3, title: "아침의 약속", duration: 7, totalDays: 14, description: "2주 달성. 생활 패턴이 조금씩 변함.", emoji: "🌱" },
    { id: 4, title: "떠오르는 해", duration: 7, totalDays: 21, description: "습관 형성의 1차 관문(뇌의 적응기).", emoji: "🌅" },
    { id: 5, title: "단단한 빛", duration: 9, totalDays: 30, description: "한 달 달성(Month badge).", emoji: "🌤️" },
    { id: 6, title: "흔들리지 않는", duration: 20, totalDays: 50, description: "권태기 극복 구간.", emoji: "🛡️" },
    { id: 7, title: "습관의 완성", duration: 16, totalDays: 66, description: "과학적 습관 정착일. 이제 의지 없이도 일어남.", emoji: "💎" },
    { id: 8, title: "백일의 기적", duration: 34, totalDays: 100, description: "상징적 달성. '사람이 되었다'는 느낌.", emoji: "🐻" },
    { id: 9, title: "찬란한 여정", duration: 80, totalDays: 180, description: "반년 달성. 웬만해선 무너지지 않음.", emoji: "✨" },
    { id: 10, title: "황금빛 아침", duration: 185, totalDays: 365, description: "4계절을 모두 겪어낸 진정한 모닝 러너.", emoji: "🏆" },
    { id: 11, title: "태양의 주인", duration: 365, totalDays: 730, description: "고인물 단계.", emoji: "👑" },
    { id: 12, title: "무한의 우주", duration: 365, totalDays: 1095, description: "명예의 전당 (최종).", emoji: "🌌" }
];

export const getChapterInfo = (currentTotalDays) => {
    // If 0 days, show first chapter
    if (currentTotalDays === 0) return { chapter: CHAPTERS[0], progress: 0, dayInChapter: 0 };

    for (let i = 0; i < CHAPTERS.length; i++) {
        const chapter = CHAPTERS[i];
        const prevTotal = i === 0 ? 0 : CHAPTERS[i - 1].totalDays;

        if (currentTotalDays <= chapter.totalDays) {
            const dayInChapter = currentTotalDays - prevTotal;
            const progress = (dayInChapter / chapter.duration) * 100;
            return { chapter, progress, dayInChapter };
        }
    }

    // If exceeded all chapters, return the last one
    const lastChapter = CHAPTERS[CHAPTERS.length - 1];
    return { chapter: lastChapter, progress: 100, dayInChapter: lastChapter.duration };
};
