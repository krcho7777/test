# English Speaking Coach

AI와의 영어 대화 내용을 분석해 말하기 능력과 개선 방향을 알려 주는 에이전트 명세입니다.

- 에이전트 프롬프트와 출력 형식: [ENGLISH_SPEAKING_COACH.md](ENGLISH_SPEAKING_COACH.md)
- 사용자는 목표와 실제 영어 대화 기록을 함께 입력하면 됩니다.

## 웹 UI

- [index.html](index.html)을 브라우저에서 열어 Speakwise 코칭 화면을 실행합니다.
- `샘플 불러오기`로 예시 대화를 넣거나 직접 대화 기록을 붙여 넣습니다.
- API 키 없이 실제 AI 평가를 사용하려면 컴퓨터에 Ollama와 로컬 모델을 설치합니다.

```bash
ollama serve
ollama pull llama3.2
npm start
```

그다음 `http://localhost:8000`을 엽니다. Ollama 모델은 이 컴퓨터에서 실행되며 대화 내용이 외부 AI API로 전송되지 않습니다. GitHub Pages에서는 로컬 Ollama에 접근할 수 없으므로, 이 방식은 현재 컴퓨터에서 실행할 때 사용합니다.
