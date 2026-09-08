const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

loadEnvFile();

const port = Number(process.env.PORT || 8000);
const root = __dirname;
const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const model = process.env.OLLAMA_MODEL || 'llama3.2';

const coachPrompt = `You are an English speaking coach. Analyze only the user's English conversation in the supplied transcript. Do not assess pronunciation or intonation from text. Return valid JSON only with this shape:
{
  "estimatedLevel": "A2-B1",
  "confidence": "low|medium|high",
  "strength": { "title": "Korean sentence", "detail": "Korean sentence" },
  "averageScore": 3,
  "scores": { "fluency": 3, "accuracy": 2, "vocabulary": 3, "interaction": 3, "clarity": 3 },
  "correction": { "original": "short quote", "corrected": "natural English", "reason": "Korean explanation" },
  "practice": { "title": "Korean title", "detail": "Korean 10-15 minute practice description" },
  "nextQuestion": "An English follow-up question"
}
Scores must be integers from 1 to 5. Keep the advice specific, kind, and based on evidence. If the transcript is too short, lower confidence and say so in the strength detail.`;

const server = http.createServer(async (request, response) => {
  setCorsHeaders(response);

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method === 'POST' && request.url === '/api/evaluate') {
    await evaluate(request, response);
    return;
  }

  serveStatic(request, response);
});

server.listen(port, () => {
  console.log(`Speakwise is running at http://localhost:${port}`);
});

async function evaluate(request, response) {
  try {
    const body = await readJson(request);
    if (typeof body.conversation !== 'string' || body.conversation.trim().length < 10) {
      sendJson(response, 400, { error: '대화 기록을 10자 이상 입력해 주세요.' });
      return;
    }

    const aiResponse = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        stream: false,
        format: 'json',
        messages: [
          { role: 'system', content: coachPrompt },
          { role: 'user', content: `Goal: ${body.goal || 'not specified'}\nCurrent level: ${body.level || 'unknown'}\nConversation:\n${body.conversation}` }
        ]
      })
    });

    const data = await aiResponse.json();
    if (!aiResponse.ok) {
      console.error('Ollama error:', data.error || aiResponse.status);
      sendJson(response, 502, { error: `로컬 AI에 연결할 수 없습니다. Ollama가 실행 중인지, ${model} 모델이 설치되어 있는지 확인하세요.` });
      return;
    }

    const result = JSON.parse(data.message.content);
    sendJson(response, 200, result);
  } catch (error) {
    console.error(error);
    const message = error.cause?.code === 'ECONNREFUSED'
      ? 'Ollama가 실행 중이지 않습니다. Ollama를 설치하고 실행한 뒤 다시 시도하세요.'
      : '평가 중 문제가 발생했습니다.';
    sendJson(response, 500, { error: message });
  }
}

function serveStatic(request, response) {
  const requestedPath = request.url === '/' ? '/index.html' : request.url.split('?')[0];
  const filePath = path.resolve(root, `.${requestedPath}`);
  if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    sendJson(response, 404, { error: '페이지를 찾을 수 없습니다.' });
    return;
  }

  const contentTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
  response.writeHead(200, { 'Content-Type': contentTypes[path.extname(filePath)] || 'text/plain; charset=utf-8' });
  fs.createReadStream(filePath).pipe(response);
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let raw = '';
    request.on('data', (chunk) => { raw += chunk; if (raw.length > 100000) reject(new Error('Request too large')); });
    request.on('end', () => { try { resolve(JSON.parse(raw)); } catch { reject(new Error('Invalid JSON')); } });
    request.on('error', reject);
  });
}

function sendJson(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}

function setCorsHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}