const BASE = 'http://localhost:3000';

async function main() {
  // Ping server via /api/auth/session instead of /
  const sr = await fetch(BASE + '/api/auth/session', { method: 'POST' });
  console.log('Server session status:', sr.status);
  const c = sr.headers.get('set-cookie')?.split(';')[0];
  if (!c) { console.log('NO SESSION'); process.exit(1); }
  console.log('Session: OK\n');

  // 1. Retrieve
  const retRes = await fetch(BASE + '/api/retrieve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': c },
    body: JSON.stringify({ query: 'Aku merasa tidak percaya diri', topK: 3 }),
  });
  const retData = await retRes.json();
  console.log('Retrieve status:', retRes.status, '| chunks:', retData.chunks?.length || 0);

  // 2. Chat
  const chatRes = await fetch(BASE + '/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': c },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Aku merasa tidak percaya diri dan cemas' }],
      mode: 'santai',
      retrievedChunks: retData.chunks || [],
    }),
  });
  console.log('Chat status:', chatRes.status);

  if (!chatRes.ok) {
    const err = await chatRes.text();
    console.log('Chat error:', err.slice(0, 300));
    process.exit(1);
  }

  const reader = chatRes.body.getReader();
  const d = new TextDecoder();
  let ans = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = d.decode(value).split('\n').filter(l => l.startsWith('data: '));
    for (const l of lines) {
      const s = l.slice(6);
      if (s === '[DONE]') continue;
      try { const j = JSON.parse(s); if (j.content) ans += j.content; } catch {}
    }
  }
  console.log('Response:', ans);
}

main().catch(e => console.log('FATAL:', e.message));
