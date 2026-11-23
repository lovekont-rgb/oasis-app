'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Notification } from '@/lib/types/notification';
import { formatRelativeTime } from '@/lib/format';
import { NOTIFICATION_ICONS } from '@/lib/notification-meta';
import { getBellData, markAllRead, markRead } from '@/app/notifications/actions';
import styles from './notificationBell.module.css';

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let stopped = false;
    const load = async () => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
      try {
        const data = await getBellData();
        if (!stopped) {
          setCount(data.count);
          setItems(data.items);
        }
      } catch {
        // 忽略轮询失败
      }
    };
    load();
    const timer = window.setInterval(load, 60000);
    const onVisible = () => { if (document.visibilityState === 'visible') load(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const onItemClick = async (n: Notification) => {
    setOpen(false);
    if (!n.is_read) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
      setCount((c) => Math.max(0, c - 1));
      try { await markRead(n.id); } catch { /* 忽略 */ }
    }
    if (n.link) router.push(n.link);
  };

  const onMarkAll = async () => {
    setItems((prev) => prev.map((x) => ({ ...x, is_read: true })));
    setCount(0);
    try { await markAllRead(); } catch { /* 忽略 */ }
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.bell}
        onClick={() => setOpen((v) => !v)}
        aria-label="消息通知"
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {count > 0 && (
          <span className={styles.badge}>{count > 99 ? '99+' : count}</span>
        )}
      </button>

      {open && (
        <div className={styles.panel} role="dialog" aria-label="最近消息">
          <div className={styles.panelHead}>
            <span>消息通知</span>
            {count > 0 && (
              <button type="button" className={styles.markAll} onClick={onMarkAll}>
                全部已读
              </button>
            )}
          </div>

          <div className={styles.list}>
            {items.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>🔔</div>
                <div>暂无新消息</div>
              </div>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={`${styles.item} ${n.is_read ? styles.read : ''}`}
                  onClick={() => onItemClick(n)}
                >
                  <span className={styles.icon}>{NOTIFICATION_ICONS[n.type] ?? '🔔'}</span>
                  <span className={styles.itemBody}>
                    <span className={styles.itemTitle}>{n.title}</span>
                    {n.content && <span className={styles.itemContent}>{n.content}</span>}
                    <span className={styles.itemTime}>{formatRelativeTime(n.created_at)}</span>
                  </span>
                </button>
              ))
            )}
          </div>

          <Link href="/notifications" className={styles.viewAll} onClick={() => setOpen(false)}>
            查看全部消息 →
          </Link>
        </div>
      )}
    </div>
  );
}