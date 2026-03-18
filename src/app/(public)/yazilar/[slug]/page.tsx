import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ArticleContent } from "@/components/articles/article-content";
import { ShareButtons } from "@/components/articles/share-buttons";
import { ArticleCard } from "@/components/articles/article-card";
import { formatDate } from "@/lib/utils/format-date";
import type { Article } from "@/lib/types";

export const revalidate = 600;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data as Article | null;
}

async function getRelatedArticles(
  categoryId: string,
  currentId: string
): Promise<Article[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("is_published", true)
    .eq("category_id", categoryId)
    .neq("id", currentId)
    .order("published_at", { ascending: false })
    .limit(3);
  return (data as Article[]) || [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Yazı Bulunamadı" };

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt || undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      images: article.cover_image_url ? [article.cover_image_url] : [],
      type: "article",
      publishedTime: article.published_at || undefined,
      authors: [article.author_name],
    },
  };
}

export async function generateStaticParams() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("articles")
      .select("slug")
      .eq("is_published", true);
    return data?.map((a) => ({ slug: a.slug })) || [];
  } catch {
    return [];
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const relatedArticles = await getRelatedArticles(
    article.category_id,
    article.id
  );

  const articleUrl = `https://kalbininmevsimi.com/yazilar/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: { "@type": "Person", name: article.author_name },
    image: article.cover_image_url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Back link */}
        <Link
          href="/yazilar"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={14} />
          Tüm Yazılar
        </Link>

        {/* Header */}
        <header className="mb-10">
          {article.category && (
            <Link
              href={`/${article.category.slug}`}
              className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {article.category.name}
            </Link>
          )}

          <h1 className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {article.author_name}
            </span>
            {article.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(article.published_at)}
              </span>
            )}
            {article.reading_time_minutes && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {article.reading_time_minutes} dk okuma
              </span>
            )}
          </div>
        </header>

        {/* Cover Image */}
        {article.cover_image_url && (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        )}

        {/* Content */}
        <ArticleContent content={article.content} />

        {/* Share */}
        <div className="mt-10 border-t border-border pt-6">
          <ShareButtons title={article.title} url={articleUrl} />
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-border bg-muted py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-8 font-serif text-2xl font-bold text-foreground">
              İlgili Yazılar
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
