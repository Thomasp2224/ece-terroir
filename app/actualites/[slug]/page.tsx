'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useData } from '@/lib/context/DataContext';
import { formatDateFrench } from '@/lib/utils';
import { ArrowLeft, Clock, Calendar, Tag, Sparkles } from 'lucide-react';

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { posts } = useData();

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="py-20 text-center bg-[#FDFBF7] min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="font-serif-title font-bold text-2xl text-[#58111A]">Article introuvable</h2>
        <p className="text-xs text-[#78716C]">Cet article a peut-être été déplacé ou supprimé.</p>
        <Link
          href="/actualites"
          className="px-5 py-2.5 rounded-xl bg-[#58111A] text-[#FDFBF7] text-xs font-bold shadow-md hover:bg-[#722F37]"
        >
          Retour au Journal du Terroir
        </Link>
      </div>
    );
  }

  const relatedPosts = posts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <article className="py-12 sm:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          href="/actualites"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#58111A] hover:text-[#722F37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
          <span>Retour aux actualités</span>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#58111A] text-[#FDFBF7] text-xs font-bold shadow-sm">
            {post.category}
          </div>

          <h1 className="font-serif-title font-extrabold text-3xl sm:text-5xl text-[#58111A] leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#EAE2D8] text-xs text-[#78716C]">
            <div className="flex items-center gap-3">
              {post.author.avatarUrl ? (
                <img
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#58111A] text-[#D4AF37] font-bold flex items-center justify-center">
                  {post.author.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-bold text-sm text-[#1D1917]">{post.author.name}</p>
                <p className="text-[11px] text-[#78716C]">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                {formatDateFrench(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                {post.readTimeMinutes} min de lecture
              </span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl border border-[#EAE2D8]">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Body */}
        <div className="bg-[#FFFFFF] p-8 sm:p-12 rounded-3xl border border-[#EAE2D8] shadow-sm space-y-6 text-[#1D1917] leading-relaxed text-sm sm:text-base">
          <div 
            className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:text-[#58111A] prose-blockquote:border-l-4 prose-blockquote:border-[#D4AF37] prose-blockquote:bg-[#F6F1EA] prose-blockquote:p-4 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-[#58111A]"
          >
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return <h3 key={index} className="font-serif-title font-bold text-2xl text-[#58111A] mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
              }
              if (paragraph.startsWith('#### ')) {
                return <h4 key={index} className="font-serif-title font-semibold text-xl text-[#1B3B2B] mt-6 mb-3">{paragraph.replace('#### ', '')}</h4>;
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={index} className="border-l-4 border-[#D4AF37] bg-[#F6F1EA] p-4 rounded-r-2xl italic text-[#58111A] my-6">
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              return <p key={index} className="text-[#3A3533] leading-relaxed mb-4">{paragraph}</p>;
            })}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-8 border-t border-[#EAE2D8] flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#78716C] mr-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#D4AF37]" /> Thématiques :
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-[#F6F1EA] text-[#58111A] text-xs font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="pt-12 border-t border-[#EAE2D8] space-y-6">
            <h3 className="font-serif-title font-bold text-2xl text-[#58111A]">
              D&apos;autres articles à découvrir
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/actualites/${related.slug}`}
                  className="terroir-card rounded-2xl p-4 bg-[#FFFFFF] border border-[#EAE2D8] flex gap-4 items-center group"
                >
                  <img
                    src={related.coverImageUrl}
                    alt={related.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#58111A]">{related.category}</span>
                    <h4 className="font-serif-title font-bold text-sm text-[#1D1917] group-hover:text-[#58111A] transition-colors truncate">
                      {related.title}
                    </h4>
                    <p className="text-[11px] text-[#78716C] mt-1">{formatDateFrench(related.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
