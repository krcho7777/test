const sampleConversation = `User: I joined the meeting yesterday and I explain our plan.
AI: What was the main challenge?
User: The customer didn't understand clearly, so I said again with another words.`;

const conversationInput = document.querySelector('#conversationInput');
const charCount = document.querySelector('#charCount');
const resultContent = document.querySelector('#resultContent');
const emptyResult = document.querySelector('#emptyResult');
const evaluateButton = document.querySelector('#evaluateButton');
const sampleButton = document.querySelector('#sampleButton');
const copyQuestion = document.querySelector('#copyQuestion');

const demoScores = {
  fluency: 3,
  accuracy: 2,
  vocabulary: 3,
  interaction: 3,
  clarity: 3
};

function updateCount() {
  charCount.textContent = `${conversationInput.value.length.toLocaleString()} characters`;
}

function renderMetrics(scores) {
  const metricValues = [
    ['유창성', scores.fluency], ['정확성', scores.accuracy], ['어휘와 표현', scores.vocabulary],
    ['상호작용', scores.interaction], ['명료성', scores.clarity]
  ];
  document.querySelector('#metrics').innerHTML = metricValues.map(([label, value]) => `
    <div class="metric">
      <label>${label}</label>
      <div class="metric-value"><span>${value}</span><div class="metric-bar"><i style="width: ${value * 20}%"></i></div></div>
    </div>
  `).join('');
}

async function evaluateConversation() {
  if (!conversationInput.value.trim()) {
    conversationInput.focus();
    conversationInput.classList.add('shake');
    setTimeout(() => conversationInput.classList.remove('shake'), 350);
    return;
  }

  evaluateButton.disabled = true;
  evaluateButton.querySelector('span').textContent = '분석하는 중...';
  setTimeout(() => {
    renderResult({
      estimatedLevel: 'A2-B1',
      averageScore: 3,
      scores: demoScores,
      strength: {
        title: '의미를 끝까지 전달해요',
        detail: '상황과 원인, 결과를 연결해 설명했습니다.'
      },
      correction: {
        original: 'I explain our plan.',
        corrected: 'I explained our plan.',
        reason: 'yesterday와 함께 쓰이므로 과거형이 필요해요.'
      },
      practice: {
        title: '과거 시제로 업무 상황 말하기',
        detail: '매일 어제 있었던 일을 3문장으로 말해보세요. 과거형 동사 4개와 so 또는 because를 사용하면 성공입니다.'
      },
      nextQuestion: 'What was the customer’s main misunderstanding?'
    });
    emptyResult.classList.add('hidden');
    resultContent.classList.remove('hidden');
    evaluateButton.disabled = false;
    evaluateButton.querySelector('span').textContent = '다시 평가하기';
    document.querySelector('#resultPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 650);
}

function renderResult(result) {
  renderMetrics(result.scores);
  document.querySelector('.level-badge').innerHTML = `${result.estimatedLevel} <small>추정</small>`;
  document.querySelector('.score-main strong').textContent = result.strength.title;
  document.querySelector('.score-main p').textContent = result.strength.detail;
  document.querySelector('.score-ring strong').textContent = Number(result.averageScore).toFixed(1);
  document.querySelector('.correction p:first-child').textContent = `“${result.correction.original}”`;
  document.querySelector('.correction .corrected').textContent = `“${result.correction.corrected}”`;
  document.querySelector('.correction small').textContent = result.correction.reason;
  document.querySelector('.practice-block h3').textContent = result.practice.title;
  document.querySelector('.practice-detail p').textContent = result.practice.detail;
  document.querySelector('.next-question strong').textContent = result.nextQuestion;
}

sampleButton.addEventListener('click', () => {
  conversationInput.value = sampleConversation;
  document.querySelector('#goalInput').value = '회의에서 의견을 자신 있게 말하기';
  document.querySelector('#levelInput').value = 'B1';
  updateCount();
  conversationInput.focus();
});

conversationInput.addEventListener('input', updateCount);
evaluateButton.addEventListener('click', evaluateConversation);

copyQuestion.addEventListener('click', async () => {
  const question = document.querySelector('.next-question strong').textContent;
  try {
    await navigator.clipboard.writeText(question);
    copyQuestion.textContent = '복사됨';
    setTimeout(() => { copyQuestion.textContent = '복사'; }, 1400);
  } catch {
    copyQuestion.textContent = '선택됨';
  }
});

updateCount();