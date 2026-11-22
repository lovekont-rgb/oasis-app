import type { NotificationFilter } from './types/notification';

export const NOTIFICATION_ICONS: Record<string, string> = {
  review: '🛡️',
  reply: '💬',
  interaction: '❤️',
  account: '⚠️',
  system: '📢',
};

export const NOTIFICATION_FILTERS: { key: NotificationFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'unread', label: '未读' },
  { key: 'review', label: '审核' },
  { key: 'reply', label: '回复' },
  { key: 'interaction', label: '互动' },
  { key: 'account', label: '账号' },
  { key: 'system', label: '系统' },
];