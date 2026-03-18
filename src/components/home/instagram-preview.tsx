import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";
import type { InstagramPost } from "@/lib/types";

interface InstagramPreviewProps {
  posts: InstagramPost[];
}

export function InstagramPreview({ posts }: InstagramPreviewProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-600 dark:from-purple-950/50 dark:to-pink-950/50 dark:text-pink-400">
            <Instagram size={14} />
            Instagram
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
            Son Paylaşımlar
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {posts.slice(0, 6).map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Image
                src={
                  post.media_type === "VIDEO"
                    ? post.thumbnail_url || post.media_url
                    : post.media_url
                }
                alt={post.caption?.slice(0, 100) || "Instagram post"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <Instagram size={24} className="text-white drop-shadow-lg" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
