import { HistoryList } from "../_components/HistoryList";
import { COLORS } from "../_lib/config";

export default function SmartPostHistoryPage() {
  return (
    <main>
      <header className="px-5 pb-4 pt-6">
        <h1 className="text-2xl font-semibold">Geçmiş</h1>
        <p className="mt-1 text-sm" style={{ color: COLORS.secondary }}>
          Son postların bu telefonda saklanır.
        </p>
      </header>
      <HistoryList />
    </main>
  );
}
