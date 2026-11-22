'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Notification, NotificationFilter } from '@/lib/types/notification';
import { formatDateTime } from '@/lib/format';
import { NOTIFICATION_ICONS, NOTIFICATION_FILTERS } from '@/lib/notification-meta';
import {
  deleteNotification,
  loadMore,
  markAllRead,
  markRead,
} from './actions';
import styles from './notifications.module.css';

export default function NotificationsClient({ initialItems }: { initialItems: Notification[] }) {
  const [items, setItems] = useState<Notification[]>(initialItems);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialItems.length === 20);
  const router = useRouter();

  const unreadCount = useMemo(() => items.filter((n) => !n.is_read).length, [items]);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    if (filter === 'unread') return items.filter((n) => !n.is_read);
    return items.filter((n) => n.type === filter);
  }, [items, filter]);

  const onItem = async (n: Notification) => {
    if (!n.is_read) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
      try { await markRead(n.id); } catch { /* 忽略 */ }
    }
    if (n.link) router.push(n.link);
  };

  const onMarkAll = async () => {
    setItems((prev) => prev.map((x) => ({ ...x, is_read: true })));
    try { await markAllRead(); } catch { /* 忽略 */ }
  };

  const onDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm('确定删除这条消息？')) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
    try { await deleteNotification(id); } catch { /* 忽略 */ }
  };

  const onLoadMore = async () => {
    if (loadingMore || items.length === 0) return;
    setLoadingMore(true);
    try {
      const last = items[items.length - 1];
      const res = await loadMore(last.created_at, filter);
      if (res.items.length > 0) {
        setItems((prev) => {
          const seen = new Set(prev.map((x) => x.id));
          return [...prev, ...res.items.filter((x) => !seen.has(x.id))];
        });
      }
      setHasMore(res.items.length === 20);
    } catch {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          {NOTIFICATION_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`${styles.tab} ${filter === f.key ? styles.tabActive : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              {f.key === 'unread' && unreadCount > 0 && (
                <span className={styles.tabCount}>{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <button type="button" className={styles.markAllBtn} onClick={onMarkAll}>
            全部标为已读
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔔</div>
          <p className={styles.emptyTitle}>
            暂无{filter === 'all' ? '' : NOTIFICATION_FILTERS.find((f) => f.key === filter)?.label}消息
          </p>
          <p className={styles.emptyHint}>审核结果、官方回复和作品互动会在这里通知你。</p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`${styles.card} ${n.is_read ? styles.read : styles.unread}`}
              onClick={() => onItem(n)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onItem(n); }}
            >
              <span className={styles.cardIcon}>{NOTIFICATION_ICONS[n.type] ?? '🔔'}</span>
              <div className={styles.cardBody}>
                <div className={styles.cardTitle}>
                  {n.title}
                  {!n.is_read && <span className={styles.dot} />}
                </div>
                {n.content && <div className={styles.cardContent}>{n.content}</div>}
                <div className={styles.cardTime}>{formatDateTime(n.created_at)}</div>
              </div>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={(e) => onDelete(e, n.id)}
                aria-label="删除消息"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {hasMore && filtered.length > 0 && (
        <div className={styles.loadMore}>
          <button
            type="button"
            className={styles.loadMoreBtn}
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? '加载中…' : '加载更多'}
          </button>
        </div>
      )}
    </>
  );
}