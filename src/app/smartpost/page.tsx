import { PostEditor } from "./_components/PostEditor";
import { COLORS } from "./_lib/config";

export default function SmartPostPage() {
  return (
    <main>
      <header
        className="px-5 pt-6"
        style={{ borderColor: COLORS.divider }}
      >
        <h1 className="text-2xl font-semibold">SmartPost</h1>
        <p className="mt-1 text-sm" style={{ color: COLORS.secondary }}>
          Fotoğrafını seç, yazını yaz, telefonuna kaydet.
        </p>
      </header>
      <PostEditor />
    </main>
  );
}
