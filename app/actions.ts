'use server';

import { revalidatePath } from 'next/cache';

/**
 * Server Action to purge and revalidate Next.js cache on Vercel on-demand.
 * This ensures visitors get super-fast static CDN speeds (0ms TTFB),
 * while admin changes take effect immediately without needing redeploy.
 */
export async function revalidateSite(path: string = '/') {
  try {
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
