'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleFollow(targetUserId: string, isFollowing: boolean, targetUsername: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: '请先登录' };
  if (user.id === targetUserId) return { success: false, error: '不能关注自己' };

  if (isFollowing) {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: user.id, following_id: targetUserId });
    if (error) return { success: false, error: error.message };
  }
  
  revalidatePath(`/portfolio/author/${targetUsername}`);
  revalidatePath('/dashboard');
  return { success: true };
}