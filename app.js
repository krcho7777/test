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

const metrics = [
  ['유창성', 3],
  ['정확성', 2],
  ['어휘와 표현', 3],
  ['상호작용', 3],
  ['명료성', 3]
];

function updateCount() {
  charCount.textContent = `${conversationInput.value.length.toLocaleString()} characters`;
}

function renderMetrics() {
  document.querySelector('#metrics').innerHTML = metrics.map(([label, value]) => `
    <div class="metric">
      <label>${label}</label>
      <div class="metric-value"><span>${value}</span><div class="metric-bar"><i style="width: ${value * 20}%"></i></div></div>
    </div>
  `).join('');
}

function evaluateConversation() {
  if (!conversationInput.value.trim()) {
    conversationInput.focus();
    conversationInput.classList.add('shake');
    setTimeout(() => conversationInput.classList.remove('shake'), 350);
    return;
  }

  evaluateButton.disabled = true;
  evaluateButton.querySelector('span').textContent = '분석하는 중...';
  setTimeout(() => {
    renderMetrics();
    emptyResult.classList.add('hidden');
    resultContent.classList.remove('hidden');
    evaluateButton.disabled = false;
    evaluateButton.querySelector('span').textContent = '다시 평가하기';
    document.querySelector('#resultPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 650);
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