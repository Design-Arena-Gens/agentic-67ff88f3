"use client";

import { useEffect, useRef, useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  citations?: { title: string; source: string }[];
};

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hello! I can help explain legal terminology and discuss lesser-known, still-active laws. Ask me about a term (e.g., ?res judicata?), a doctrine, or an obscure law. This is educational and not legal advice.'
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function onSend() {
    const question = input.trim();
    if (!question) return;
    setInput("");
    setMessages(m => [...m, { role: 'user', content: question }]);
    setLoading(true);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      const answer: Message = {
        role: 'assistant',
        content: data.answer,
        citations: data.citations
      };
      setMessages(m => [...m, answer]);
    } catch (e) {
      setMessages(m => [...
        m,
        { role: 'assistant', content: 'Sorry, I ran into an issue answering that. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="card">
      <div ref={listRef} className="messages" style={{ maxHeight: 420, overflowY: 'auto', padding: '4px 2px 8px' }}>
        {messages.map((m, idx) => (
          <div className="msg" key={idx}>
            <span className={`badge ${m.role === 'user' ? 'user' : 'assistant'}`}>{m.role}</span>
            <div>
              <div>{m.content}</div>
              {!!m.citations?.length && (
                <div className="citations">
                  Sources: {m.citations.map((c, i) => (
                    <span key={i}>{c.title}{c.source ? ` (${c.source})` : ''}{i < (m.citations!.length - 1) ? ', ' : ''}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="inputRow" style={{ marginTop: 12 }}>
        <input
          className="input"
          placeholder="Ask about a legal term or obscure law..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={loading}
        />
        <button className="button" onClick={onSend} disabled={loading}>{loading ? 'Thinking?' : 'Ask'}</button>
      </div>
      <div className="disclaimer">This assistant is for educational purposes and does not provide legal advice. Consult a licensed attorney for advice about your specific situation.</div>
    </div>
  );
}
