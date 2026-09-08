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
  try {
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        goal: document.querySelector('#goalInput').value,
        level: document.querySelector('#levelInput').value,
        conversation: conversationInput.value
      })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '평가에 실패했습니다.');
    renderResult(result);
    emptyResult.classList.add('hidden');
    resultContent.classList.remove('hidden');
    document.querySelector('#resultPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    window.alert(error.message);
  } finally {
    evaluateButton.disabled = false;
    evaluateButton.querySelector('span').textContent = '다시 평가하기';
  }
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