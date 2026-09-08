# English Speaking Coach

AI와의 영어 대화 내용을 분석해 말하기 능력과 개선 방향을 알려 주는 에이전트 명세입니다.

- 에이전트 프롬프트와 출력 형식: [ENGLISH_SPEAKING_COACH.md](ENGLISH_SPEAKING_COACH.md)
- 사용자는 목표와 실제 영어 대화 기록을 함께 입력하면 됩니다.

## 웹 UI

- [index.html](index.html)을 브라우저에서 열어 Speakwise 코칭 화면을 실행합니다.
- `샘플 불러오기`로 예시 대화를 넣거나 직접 대화 기록을 붙여 넣습니다.
- 현재 평가는 API 없이 동작을 확인하는 로컬 데모이며, `app.js`의 `evaluateConversation` 함수가 실제 AI API 연결 지점입니다.
