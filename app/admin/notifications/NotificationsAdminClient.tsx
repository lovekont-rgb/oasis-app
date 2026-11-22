'use client';

import { useState } from 'react';
import { sendBroadcast } from './actions';

export default function NotificationsAdminClient() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setSubmitting(true);
    const fd = new FormData();
    fd.set('title', title);
    fd.set('content', content);
    fd.set('link', link);
    try {
      const res = await sendBroadcast(fd);
      if (res.success) {
        setMsg({ type: 'ok', text: `已发送给 ${res.count ?? 0} 位用户` });
        setTitle('');
        setContent('');
        setLink('');
      } else {
        setMsg({ type: 'err', text: res.error ?? '发送失败' });
      }
    } catch (err) {
      setMsg({ type: 'err', text: err instanceof Error ? err.message : '发送失败' });
    }
    setSubmitting(false);
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        maxWidth: 640,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 24,
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16,
      }}
    >
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>标题</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder="例如：平台新功能上线"
          style={inputStyle}
        />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>内容</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          rows={5}
          placeholder="简要说明，最多 500 字"
          style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
        />
        <span style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'right' }}>
          {content.length} / 500
        </span>
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          跳转链接（可选，站内路径，如 /paths）
        </span>
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="/paths"
          style={inputStyle}
        />
      </label>

      {msg && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 13,
            background: msg.type === 'ok' ? 'rgba(60, 220, 140, 0.1)' : 'var(--danger-bg)',
            color: msg.type === 'ok' ? 'var(--green)' : 'var(--danger)',
            border: `1px solid ${msg.type === 'ok' ? 'var(--green)' : 'var(--danger)'}`,
          }}
        >
          {msg.text}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          alignSelf: 'flex-start',
          padding: '10px 28px',
          borderRadius: 100,
          border: 'none',
          background: submitting
            ? 'var(--border-subtle)'
            : 'linear-gradient(120deg, var(--cyan), #4ae0ff)',
          color: '#05070d',
          fontWeight: 700,
          fontSize: 14,
          cursor: submitting ? 'not-allowed' : 'pointer',
          boxShadow: submitting ? 'none' : '0 0 30px rgba(0, 212, 255, 0.3)',
          transition: 'all 0.3s ease',
        }}
      >
        {submitting ? '发送中…' : '发送公告'}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid var(--border-subtle)',
  background: 'rgba(0, 0, 0, 0.2)',
  color: 'var(--text-primary)',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
};