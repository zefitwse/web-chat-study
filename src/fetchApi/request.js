
// api/sendQuestion.js
export function sendQuestion(prompt, signal) {
    return fetch('http://localhost:3001/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain', // 或 application/json
        Connection:'keep-alive'
      },
      body: JSON.stringify({ prompt }),
      signal,
    });
  }
  