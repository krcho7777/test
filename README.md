# English Speaking Coach

AI와의 영어 대화 내용을 분석해 말하기 능력과 개선 방향을 알려 주는 에이전트 명세입니다.

- 에이전트 프롬프트와 출력 형식: [ENGLISH_SPEAKING_COACH.md](ENGLISH_SPEAKING_COACH.md)
- 사용자는 목표와 실제 영어 대화 기록을 함께 입력하면 됩니다.

## 웹 UI

- [index.html](index.html)을 브라우저에서 열어 Speakwise 코칭 화면을 실행합니다.
- `샘플 불러오기`로 예시 대화를 넣거나 직접 대화 기록을 붙여 넣습니다.
- 현재 평가는 API 없이 동작을 확인하는 로컬 데모입니다. 입력한 대화와 관계없이 예시 결과를 표시합니다.
- 실제 AI 평가를 연결하려면 별도 백엔드 API를 추가해야 합니다. API 키는 브라우저 코드에 넣지 않습니다.

## Copilot에서 HTML 보고서 만들기

1. Copilot Chat에서 `/english-speaking-report`를 실행합니다.
2. 같은 메시지에 평가할 AI 대화 내용을 붙여 넣습니다.
3. Copilot이 `reports/english-speaking-report.html`을 생성하면 파일을 브라우저에서 엽니다.

프롬프트는 [.github/prompts/english-speaking-report.prompt.md](.github/prompts/english-speaking-report.prompt.md)에 있으며, API 키나 외부 AI 서버 없이 현재 Copilot 대화에서 보고서를 생성하도록 안내합니다.
