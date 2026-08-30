import { NextResponse } from 'next/server';
import { SocialPost } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 1800; // 30 minutes

const BEHOLD_FEED_URL = process.env.INSTAGRAM_FEED_URL || 'https://feeds.behold.so/r9AjyLBzjUahSGLW8RwD';

export async function GET() {
  try {
    const res = await fetch(BEHOLD_FEED_URL, {
      next: { revalidate: 1800 },
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Behold API error: ${res.statusText}`);
    }

    const data = await res.json();
    const rawPosts = Array.isArray(data) ? data : data?.posts || [];

    const formattedPosts: SocialPost[] = rawPosts.map((p: any) => ({
      id: p.id ? `insta-${p.id}` : `insta-${Date.now()}`,
      platform: 'instagram',
      author: 'ECE Terroir',
      handle: '@eceterroir',
      content: p.prunedCaption || p.caption || 'Échoppe & festins de terroir • Campus ECE Paris 🧀🍷',
      mediaUrl: p.sizes?.large?.mediaUrl || p.sizes?.medium?.mediaUrl || p.sizes?.small?.mediaUrl || p.mediaUrl,
      likesCount: typeof p.likeCount === 'number' ? p.likeCount : 0,
      commentsCount: typeof p.commentsCount === 'number' ? p.commentsCount : 0,
      postUrl: p.permalink || 'https://www.instagram.com/eceterroir/',
      publishedAt: p.timestamp || new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Erreur récupération Instagram Feed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Impossible de charger le flux Instagram',
        posts: [],
      },
      { status: 500 }
    );
  }
}
