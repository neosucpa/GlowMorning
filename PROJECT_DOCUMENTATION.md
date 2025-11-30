# GlowMorning 프로젝트 문서

## 📋 프로젝트 개요

**GlowMorning**은 사용자가 이른 아침 기상 습관을 형성하고, 매일의 아침을 기록하며, 자신의 성장을 시각적으로 확인할 수 있는 모닝 루틴 관리 애플리케이션입니다.

### 핵심 가치
- **습관 형성**: 과학적 근거(66일 습관 형성 이론)에 기반한 단계별 챕터 시스템
- **감성적 동기부여**: 게임화된 배지 시스템과 감성적인 UI/UX
- **시각적 기록**: 사진과 글을 통한 일상 기록 및 회고

### 기술 스택
- **Frontend**: React 19.2.0, Vite 7.2.4
- **Routing**: React Router DOM 7.9.6
- **Storage**: LocalStorage (오프라인 우선)
- **Build Tool**: Vite

---

## 🎬 스토리보드 및 사용자 플로우

### 1단계: 온보딩 및 서약
1. **Splash Screen** → 앱 로고 표시
2. **Intro Screen** → 서비스 소개 및 핵심 가치 전달
3. **Onboarding** (6단계)
   - Step 1: Welcome - 서비스 소개 및 시작하기
   - Step 2: 현재 기상 시간 입력 (24시간 형식)
   - Step 3: 목표 기상 시간 입력 (24시간 형식, 시간 차이 자동 계산)
   - Step 4: 기상 후 할일 입력 (자유 텍스트, 추천 옵션 제공)
   - Step 5: 다짐 입력 (매일 아침 눈뜰 때의 다짐, 30자 제한)
   - Step 6: 수면 시간 설정 (5.5~8시간, 권장 취침 시간 자동 계산)
4. **Pledge Screen** → 서약서 작성 및 사용자 이름 입력 후 Dashboard로 이동

### 2단계: 메인 대시보드
**Dashboard Screen**
- **Chapter Header**: 현재 진행 중인 챕터 (12단계 시스템)
  - 진행률 바 표시
  - 이모지와 챕터명 중앙 정렬
- **Weekly Calendar**: 주간 캘린더 (일요일~토요일)
  - 날짜별 성공/부분성공/실패 상태 표시
  - 오늘 날짜 하이라이트
- **Wake Up Card**: 시간대별 동적 상태 카드
  - **Sleep State**: 취침 시간 전/후
  - **Active State**: 목표 시간 ±60분 (기상 버튼 활성화)
  - **Success State**: 기상 완료 (사전인증/알람인증/직접인증)
  - **Fail State**: 목표 시간 경과 (직접 입력 가능)
- **Morning Log Card**: 오늘의 기록 작성
  - 사진 업로드 (압축 처리)
  - 메모 작성
- **Stats Section**: 연속 성공일, 총 달성일, 앞서간 시간

### 3단계: 기록 (Records)
**Records Screen**
- **Monthly Calendar View**
  - 월간 캘린더
  - 기록 있는 날짜 점 표시 (오렌지: 사진, 보라: 메모, 초록: 기상만)
  - 월 이동 네비게이션
- **Instagram-Style Feed**
  - 날짜 배지 (원형, 성공 상태별 색상)
  - 기상 시간 표시
  - 사진 또는 그라데이션 플레이스홀더
  - 메모 텍스트
  - 편집 기능 (••• 버튼)

### 4단계: 통계 (Stats)
**Stats Screen**
- **The Spark (Streak Card)**: 현재 연속 기록 일수, 총 기상 횟수
- **The Flow (Weekly Chart)**: 최근 7일간 기상 시간 막대 그래프
- **The Pattern (Insight Card)**: 요일별 성공률, 월간 성공률

### 5단계: 챌린지 (Challenge)
**Challenge Screen**
- **배지 시스템** (28개 배지, 카테고리별 7개)
  - **시작의 발걸음 (누적)**: 1회 ~ 365회 누적 기록
  - **꾸준함의 미학 (연속)**: 3일 ~ 365일 연속 기록
  - **새벽을 여는 자 (시간)**: 8시 전 ~ 5시 전 조기 기상
  - **기록의 힘 (수집)**: 사진/글 10개 ~ 365개 수집
- **진행률 표시**: 미달성 배지는 진행률 바 표시
- **비주얼 구분**: 달성 배지는 선명, 미달성 배지는 흑백

### 6단계: 설정 (Settings)
**Settings Screen**
- 알림 설정
- 서약서 보기
- 버전 정보

---

## 🏗️ 아키텍처 및 파일 구조

### 디렉토리 구조
```
src/
├── pages/              # 화면 컴포넌트
│   ├── Intro.jsx
│   ├── Onboarding.jsx
│   ├── Pledge.jsx
│   ├── Dashboard.jsx
│   ├── OtherScreens.jsx  (Records, Stats, Challenge, Settings)
│   └── Alarm.jsx
├── components/         # 재사용 컴포넌트
│   ├── BottomNav.jsx
│   ├── CalendarView.jsx
│   ├── FeedView.jsx
│   ├── MorningLogModal.jsx
│   ├── TimePicker24h.jsx
│   ├── Stats/
│   │   ├── StreakCard.jsx
│   │   ├── WeeklyChart.jsx
│   │   └── InsightCard.jsx
│   └── Challenge/
│       ├── BadgeItem.jsx
│       └── BadgeGroup.jsx
├── context/            # 전역 상태 관리
│   └── AppContext.jsx
├── constants/          # 상수 정의
│   ├── chapters.js     (12단계 챕터 정의)
│   └── badges.js       (28개 배지 정의)
├── utils/              # 유틸리티 함수
│   ├── dateUtils.js
│   ├── statsUtils.js
│   └── badgeUtils.js
├── App.jsx
└── index.css
```

### 핵심 컴포넌트 설명

#### 1. AppContext (전역 상태)
- **userData**: 사용자 설정 (목표 기상 시간, 테마, 이름 등)
- **appState**: 앱 상태 (records, currentStreak, totalDays, savedTime)
- **updateRecord**: 기록 업데이트 시 자동으로 통계 재계산

#### 2. Dashboard.jsx
- **WakeUpCard**: 시간대별 동적 상태 관리
  - `getCardState()`: 현재 시간과 목표 시간 비교하여 상태 결정
  - 수동 입력 모달 (TimePicker24h)
- **MorningLogCard**: 재사용 가능 모달 컴포넌트로 리팩토링

#### 3. CalendarView.jsx
- 월간 캘린더 렌더링
- 기록 상태별 점 표시 (완벽/부분/실패)

#### 4. FeedView.jsx
- Instagram 스타일 피드 카드
- 편집 기능 (onEdit prop)

#### 5. Stats 컴포넌트들
- **statsUtils.js**: 연속 기록, 주간 데이터, 요일별/월간 성공률 계산
- **StreakCard**: 연속 기록 불꽃 메타포
- **WeeklyChart**: 주간 기상 시간 막대 차트
- **InsightCard**: 베스트 요일, 월간 성공률

#### 6. Challenge 컴포넌트들
- **badgeUtils.js**: 배지 진행률 계산 (누적, 연속, 시간, 수집)
- **BadgeItem**: 개별 배지 (잠금/해제 상태, 진행률)
- **BadgeGroup**: 카테고리별 배지 그룹

---

## 📊 데이터 모델

### userData 구조
```javascript
{
  currentWakeTime: '08:00',  // 24시간 형식
  targetWakeTime: '05:30',
  goal: '독서와 명상으로 하루를 준비하고 싶어요',
  resolution: '작은 성취가 쌓여, 더 단단한 나를 만들 거야.',
  sleepDuration: 7,
  onboardingCompleted: true,
  completedAt: '2025-11-29T12:00:00Z',
  username: '홍길동'
}
```

### appState 구조
```javascript
{
  currentScreen: 'dashboard',
  records: {
    '2025-11-29': {
      wake: true,
      wakeTime: '2025-11-29T06:30:00Z',
      verificationType: 'manual', // 'pre-auth' | 'alarm' | 'manual'
      isSuccess: true,
      photoUrl: 'data:image/...',
      morningNote: '오늘도 좋은 아침!',
      completed: true
    }
  },
  currentStreak: 5,
  totalDays: 15,
  savedTime: 22.5
}
```

---

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: `#8B7FDC` (보라)
- **Success**: `#4CAF50` (초록)
- **Warning**: `#FF9800` (오렌지)
- **Error**: `#FF5252` (빨강)
- **Text Primary**: `#2D2A3E`
- **Text Secondary**: `#9E9E9E`
- **Background**: `#F8F7FC`

### 주요 디자인 원칙
1. **감성적 디자인**: 부드러운 그라데이션, 미묘한 애니메이션
2. **직관적 UI**: 명확한 시각적 피드백 (색상, 아이콘, 배지)
3. **일관성**: 통일된 컴포넌트 스타일 (border-radius: 16-24px)

---

## 🚀 주요 기능 구현 상세

### 1. Chapter 시스템 (12단계)
```javascript
// src/constants/chapters.js
CHAPTERS = [
  { id: 1, title: "작은 불씨", duration: 3, totalDays: 3 },
  { id: 2, title: "새벽의 틈", duration: 4, totalDays: 7 },
  ...
  { id: 12, title: "무한의 우주", duration: 365, totalDays: 1095 }
]
```
- `getChapterInfo(totalDays)`: 현재 총 달성일에 따라 챕터 및 진행률 계산

### 2. 배지 시스템 (28개)
**배지 타입**:
- `count`: 누적 기록 횟수
- `streak`: 연속 기록 일수
- `time_count`: 특정 시간 이전 기상 횟수
- `photo_count`: 사진 기록 횟수
- `note_count`: 글 기록 횟수

**진행률 계산**:
```javascript
calculateBadgeProgress(records, badgeCondition) {
  // 타입별 로직 분기
  // 현재값, 목표값, 퍼센트, 잠금해제 여부 반환
}
```

### 3. 통계 계산
- **연속 기록**: 최대 연속 일수 (과거 포함)
- **주간 데이터**: 최근 7일 기상 시간 (시간 단위 변환)
- **요일별 성공률**: 요일별 성공 횟수 집계
- **월간 성공률**: 현재 월의 경과일 기준 계산

### 4. 이미지 압축
```javascript
compressImage(file, maxWidth = 1024, quality = 0.8)
// Canvas API 활용하여 이미지 리사이징 및 압축
// LocalStorage 용량 제한 대응
```

### 5. 실시간 상태 업데이트
- `updateRecord` 호출 시 `totalDays`, `currentStreak` 자동 재계산
- Chapter 진행률 즉시 반영

---

## 🔧 개발 플랜 및 완료 현황

### ✅ 완료된 기능
1. **온보딩 플로우**
   - Intro, Onboarding (6단계), Pledge
2. **메인 대시보드**
   - Chapter 헤더 (중앙 정렬, 폰트 크기 증가)
   - 주간 캘린더 (월 자동 갱신)
   - 기상 카드 (시간대별 상태, 수동 입력)
   - 모닝 로그 카드 (사진/메모 업로드)
3. **Records 페이지**
   - 월간 캘린더 뷰
   - Instagram 스타일 피드
   - 편집 기능 (MorningLogModal 재사용)
4. **Stats 페이지**
   - Streak Card, Weekly Chart, Insight Card
5. **Challenge 페이지**
   - 28개 배지 시스템
   - 진행률 표시
6. **Settings 페이지**
   - 알림 설정, 서약서 보기, 버전 정보

### 🎯 주요 개선 사항
1. **용어 통일**: "아침 기록" → "오늘의 기록"
2. **배지 확장**: 8개 → 28개 (장기 목표 지원)
3. **진행률 시각화**: 누적 배지에도 그래프 추가
4. **UI 개선**:
   - Feed 카드 디자인 리팩토링 (날짜 배지, 기상 시간 헤더)
   - Chapter 타이틀 중앙 정렬 및 폰트 확대
   - 늦은 기상 상태 추가 (주황색 카드)

---

## 🐛 알려진 이슈 및 해결

### 해결된 이슈
1. ✅ **Chapter 진행률 미반영**
   - 원인: `updateRecord`에서 `totalDays` 미갱신
   - 해결: `AppContext.jsx`에 통계 재계산 로직 추가

2. ✅ **수동 입력 시 UI 미업데이트**
   - 원인: `isSuccess: false`인 경우 'fail' 상태로 처리
   - 해결: `getCardState`에서 `wake: true`면 'success' 반환하도록 수정

3. ✅ **import 에러**
   - 원인: 함수 내부에 import 문 삽입
   - 해결: 파일 상단으로 import 이동

---

## 📱 사용자 시나리오 예시

### 시나리오 1: 신규 사용자
1. 앱 설치 후 Intro 화면 확인 ("보통 사람들은 아침 8시에 눈을 뜹니다")
2. Onboarding 시작
   - Step 2: 현재 기상 시간 입력 (08:00)
   - Step 3: 목표 기상 시간 입력 (05:30)
   - Step 4: 기상 후 할일 입력 ("독서와 명상으로 하루를 준비하고 싶어요")
   - Step 5: 다짐 입력 ("작은 성취가 쌓여, 더 단단한 나를 만들 거야.")
   - Step 6: 수면 시간 설정 (7시간, 권장 취침 시간 자동 표시)
3. Pledge에서 서약서 작성 및 이름 입력
4. Dashboard로 이동 (환영 모달 표시)
5. Chapter 1 "작은 불씨" 0/3일 확인

### 시나리오 2: 3일차 사용자
1. 아침 6시에 Dashboard 접속
2. Active 상태 확인 ("일어날 시간이에요!")
3. "지금 일어났어요!" 버튼 클릭 (사전 인증)
4. Morning Log Card에서 창밖 사진 촬영 및 메모 작성
5. Stats 탭에서 3일 연속 기록 확인
6. Challenge 탭에서 "첫 걸음", "작심삼일 극복" 배지 획득 확인
7. Chapter 진행률 100% 확인 → Chapter 2로 승급

### 시나리오 3: 실패 후 복귀
1. 목표 시간 경과 (오전 8시)
2. Fail 카드 표시 ("기상 시간을 놓쳤나요?")
3. "직접 입력하기" 클릭
4. TimePicker로 08:20 입력
5. 늦은 기상 카드 표시 (주황색, "😅 늦은 기상")
6. 연속 기록은 끊겼지만 총 달성일은 증가

---

## 🔮 향후 개선 방향

### 단기 개선
1. ~~다크 모드 지원~~ (선택사항)
2. ~~알람 기능 연동~~ (구현 완료: Alarm.jsx)
3. 데이터 내보내기/가져오기 (JSON)
4. 통계 차트 상세화 (월별 추이, 시간대별 분석)

### 장기 개선
1. 클라우드 동기화 (Firebase/Supabase)
2. 소셜 공유 기능
3. 친구 챌린지 시스템
4. AI 기반 아침 루틴 추천
5. 앱 알림 (Push Notification)

---

## 📚 참고 자료

### 과학적 근거
- **66일 습관 형성 이론**: Philippa Lally et al. (2009), "How are habits formed"
- **아침형 인간의 이점**: 생산성, 정신 건강, 신체 건강 향상

### 디자인 영감
- Habitica (게임화)
- Streaks (미니멀리즘)
- Day One (일기)
- Instagram (피드 디자인)

---

## 📄 라이선스 및 저작권
이 프로젝트는 개인 프로젝트로, 모든 코드와 디자인은 개발자의 저작물입니다.

---

**문서 작성일**: 2025-11-30  
**최종 업데이트**: 2025-11-30  
**버전**: v0.1.0
