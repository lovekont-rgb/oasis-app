export type NotificationType = 'review' | 'reply' | 'interaction' | 'account' | 'system';

export type NotificationFilter = 'all' | 'unread' | NotificationType;

export interface Notification {
  id: number;
  user_id: string;
  actor_id: string | null;
  type: NotificationType;
  sub_type: string | null;
  title: string;
  content: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}