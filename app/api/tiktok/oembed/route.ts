import { NextRequest, NextResponse } from 'next/server';
import { SocialPost } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL TikTok requise.' }, { status: 400 });
    }

    // Call official TikTok oEmbed public endpoint
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url.trim())}`;
    const res = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: 'Impossible de récupérer la vidéo depuis TikTok. Vérifiez que le lien est public.' },
        { status: 400 }
      );
    }

    const data = await res.json();

    const newPost: SocialPost = {
      id: `tiktok-${Date.now()}`,
      platform: 'tiktok',
      author: data.author_name || 'ECE Terroir',
      handle: data.author_unique_id ? `@${data.author_unique_id}` : '@ece.terroir',
      content: data.title || 'Vidéo festive & dégustation • ECE Terroir 🧀🎬',
      mediaUrl: data.thumbnail_url || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
      likesCount: 0,
      commentsCount: 0,
      postUrl: url.trim(),
      publishedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      post: newPost,
      raw: data,
    });
  } catch (error: any) {
    console.error('Erreur API TikTok oEmbed:', error);
    return NextResponse.json({ success: false, error: error.message || 'Erreur interne TikTok' }, { status: 500 });
  }
}
