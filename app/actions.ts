'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

/**
 * Server Action to purge and revalidate Next.js cache on Vercel on-demand.
 * This ensures visitors get super-fast static CDN speeds (0ms TTFB),
 * while admin changes take effect immediately without needing redeploy.
 * 
 * Protected: Only authenticated users with app_metadata.role === 'admin'
 * can trigger cache invalidation.
 */
export async function revalidateSite(path: string = '/') {
  try {
    // Verify admin role before allowing cache invalidation
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.app_metadata?.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    // Invalidate the public layout and pages
    revalidatePath(path, 'layout');
    revalidatePath('/', 'page');
    revalidatePath('/proyek/[id]', 'page');
    revalidatePath('/katalog/[id]', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to revalidate paths:', error);
    return { success: false };
  }
}
