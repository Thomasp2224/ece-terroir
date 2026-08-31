import { NextRequest, NextResponse } from 'next/server';
import { SocialPost } from '@/lib/types';
import { checkRateLimit, getClientIp } from '@/lib/utils/rate-limiter';
import { escapeHtml } from '@/lib/email/mailer';

export const dynamic = 'force-dynamic';

const TIKTOK_URL_REGEX = /^https:\/\/(www\.|vm\.)?tiktok\.com\/(@[\w.-]+\/video\/\d+|[\w.-]+|\S+)/i;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit({
      key: `tiktok-oembed:${ip}`,
      maxRequests: 20,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Trop de requêtes. Veuillez patienter ${rateLimit.resetSeconds} secondes.` },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { url } = body;

    if (!url || typeof url !== 'string' || !TIKTOK_URL_REGEX.test(url.trim())) {
      return NextResponse.json(
        { success: false, error: 'URL TikTok invalide. Veuillez fournir un lien public officiel TikTok (ex: https://www.tiktok.com/@eceterroir/video/...).' },
        { status: 400 }
      );
    }

    const cleanUrl = url.trim();

    // Call official TikTok oEmbed public endpoint
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`;
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
