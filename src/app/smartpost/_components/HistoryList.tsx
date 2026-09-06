"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { bundledBackgroundUrl, COLORS, FORMAT_LABEL } from "../_lib/config";
import {
  formatPostDate,
  getHistorySnapshot,
  getHistoryServerSnapshot,
  postLabel,
  removeFromHistory,
  setPendingCopy,
  subscribeHistory,
  type StoredPost,
} from "../_lib/storage";

export function HistoryList() {
  const router = useRouter();
  const posts = useSyncExternalStore(
    subscribeHistory,
    getHistorySnapshot,
    getHistoryServerSnapshot
  );

  function handleCopy(post: StoredPost) {
    setPendingCopy(post);
    router.push("/smartpost");
  }

  function handleDelete(post: StoredPost) {
    if (!window.confirm("Bu post geçmişten silinsin mi?")) return;
    removeFromHistory(post.id);
  }

  return (
    <div className="flex flex-col gap-4 px-5 pb-8">
      {posts.length === 0 ? (
        <p
          className="rounded-2xl px-5 py-10 text-center text-base"
          style={{ backgroundColor: COLORS.card, color: COLORS.secondary }}
        >
          Henüz post yok. İlkini oluşturmak için Oluştur&apos;a git.
        </p>
      ) : (
        posts.map((post) => (
          <article
            key={post.id}
            className="flex gap-4 rounded-2xl p-4"
            style={{ backgroundColor: COLORS.card }}
          >
            <div
              className="h-[104px] w-[84px] shrink-0 overflow-hidden rounded-lg"
              style={{ backgroundColor: COLORS.divider }}
            >
              {post.backgroundId && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={bundledBackgroundUrl(post.backgroundId, "jpg")}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-medium leading-snug">
                  {postLabel(post)}
                </h2>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-xs"
                  style={{ backgroundColor: COLORS.divider, color: COLORS.secondary }}
                >
                  {FORMAT_LABEL[post.format]}
                  {post.pages.length > 1 ? ` · ${post.pages.length} sayfa` : ""}
                </span>
              </div>

              <p className="mt-1 text-sm" style={{ color: COLORS.secondary }}>
                {formatPostDate(post.createdAt)}
              </p>

              <div className="mt-auto flex gap-4 pt-3 text-sm">
                <button
                  type="button"
                  onClick={() => handleCopy(post)}
                  className="underline underline-offset-4"
                  style={{ color: COLORS.accent }}
                >
                  Kopyala ve düzenle
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post)}
                  className="underline underline-offset-4"
                  style={{ color: COLORS.secondary }}
                >
                  Sil
                </button>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
