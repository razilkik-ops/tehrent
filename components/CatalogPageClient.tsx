import { useMemo, useState } from "react";
import { EquipmentCard } from "@/components/EquipmentCard";
import { EquipmentCompare } from "@/components/EquipmentCompare";
import { EquipmentFilters, type CatalogFilters } from "@/components/EquipmentFilters";
import { EquipmentVisual } from "@/components/EquipmentVisual";
import { LeadForm } from "@/components/LeadForm";
import { equipment, type Equipment } from "@/lib/equipment";

const initialFilters: CatalogFilters = {
  category: "",
  search: "",
  maxPrice: 20000,
  availability: "",
  attachment: "",
  term: "",
  weight: ""
};

export function CatalogPageClient({ initialCategory = "" }: { initialCategory?: string }) {
  const [filters, setFilters] = useState<CatalogFilters>({
    ...initialFilters,
    category: initialCategory
  });
  const [compareSlots, setCompareSlots] = useState<Array<string | null>>([null, null]);
  const [requestIds, setRequestIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return equipment.filter((item) => matchesFilters(item, filters));
  }, [filters]);

  const compareIds = compareSlots.filter((id): id is string => Boolean(id));

  function toggleSelected(id: string) {
    setCompareSlots((current) => {
      if (current.includes(id)) {
        return current.map((item) => (item === id ? null : item));
      }

      const emptyIndex = current.findIndex((item) => item === null);
      if (emptyIndex >= 0) {
        return current.map((item, index) => (index === emptyIndex ? id : item));
      }

      return [current[0], id];
    });
  }

  function addToRequest(id: string) {
    setRequestIds((current) => (current.includes(id) ? current : [...current, id]));
    document.getElementById("catalog-lead")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function selectCompareSlot(slotIndex: number, id: string | null) {
    setCompareSlots((current) =>
      current.map((item, index) => {
        if (index === slotIndex) return id;
        if (id && item === id) return null;
        return item;
      })
    );
  }

  const selectedForForm = Array.from(new Set([...compareIds, ...requestIds]));

  return (
    <div className="w-full content-gutter py-4 xl:py-6">
      <div className="grid items-start gap-6 md:grid-cols-[190px_1fr] xl:grid-cols-[250px_1fr] 2xl:grid-cols-[270px_1fr] xl:gap-6 2xl:gap-7">
        <EquipmentFilters
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(initialFilters)}
        />
        <div>
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:mb-5">
            <h2 className="text-lg font-black xl:text-2xl">Найдено {filtered.length} единиц техники</h2>
            <select className="focus-ring h-8 rounded-[8px] border border-ink/10 bg-white px-4 text-[11px] font-bold shadow-card xl:h-12 xl:px-5 xl:text-sm">
              <option>Сортировка: по популярности</option>
              <option>Сначала дешевле</option>
              <option>Свободные сегодня</option>
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-4">
            {filtered.slice(0, 8).map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                selected={compareIds.includes(item.id)}
                onToggleSelected={toggleSelected}
                onRequest={addToRequest}
              />
            ))}
          </div>
          <div className="mt-3 rounded-[10px] border border-ink/8 bg-white px-5 py-2 shadow-card xl:mt-6 xl:rounded-[12px] xl:px-7 xl:py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between xl:gap-3">
              <div className="flex items-center gap-3 xl:gap-5">
                <span className="grid size-7 shrink-0 place-items-center rounded-[7px] border border-ink/10 text-[10px] text-ink xl:size-11 xl:rounded-[10px] xl:text-base">☷</span>
                <div>
                <h2 className="text-sm font-black xl:text-lg">Не нашли нужную технику?</h2>
                <p className="mt-0.5 text-[10px] font-semibold text-ink/56 xl:mt-1 xl:text-sm">
                  Оставьте задачу, и менеджер подберет оптимальный вариант под проект.
                </p>
                </div>
              </div>
              <a
                href="#catalog-lead"
                className="inline-flex h-7 items-center justify-center rounded-[8px] border border-ink/12 px-5 text-[10px] font-black xl:h-11 xl:px-6 xl:text-sm"
              >
                Получить подбор
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 xl:mt-10">
        <EquipmentCompare
          items={equipment}
          selectedIds={compareSlots}
          onSelect={selectCompareSlot}
          onClear={() => setCompareSlots([null, null])}
        />
      </div>

      <section id="catalog-lead" className="relative isolate mt-6 grid min-h-[120px] gap-4 overflow-hidden rounded-[14px] bg-night p-3 text-white shadow-soft md:grid-cols-[1fr_235px_250px] md:items-center xl:mt-10 xl:min-h-[134px] xl:rounded-[16px] xl:grid-cols-[0.9fr_0.7fr_0.8fr] xl:p-10">
        <div className="relative z-10">
          <h2 className="text-lg font-black leading-tight xl:text-[34px]">Не нашли нужную позицию?</h2>
          <p className="mt-1.5 max-w-xl text-[10px] font-semibold leading-4 text-white/76 xl:mt-3 xl:text-base xl:leading-7">
            Опишите задачу, а мы предложим технику, проверим наличие и поможем с логистикой.
          </p>
          <div className="mt-3 grid gap-3 text-[8px] text-white/78 sm:grid-cols-3 xl:mt-8 xl:gap-4 xl:text-sm">
            {["Подберем по задаче", "Предложим лучшие условия", "Поможем с логистикой"].map((item) => (
              <span key={item} className="font-bold xl:rounded-[10px] xl:bg-white/8 xl:p-4">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10">
        <LeadForm
          sourcePage="catalog"
          formType="catalog-help"
          selectedEquipment={selectedForForm}
          dark
          compact
          minimal
        />
        </div>
        <div className="-my-3 -mr-3 hidden h-[120px] overflow-hidden md:block xl:hidden">
          <EquipmentVisual type="truck" variant="dark" className="h-full !min-h-0 rounded-none opacity-90" />
        </div>
        <EquipmentVisual
          type="truck"
          variant="dark"
          className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden !min-h-0 w-[42%] rounded-none opacity-78 xl:block"
        />
      </section>
    </div>
  );
}

function matchesFilters(item: Equipment, filters: CatalogFilters) {
  const search = filters.search.trim().toLowerCase();
  const haystack = [
    item.title,
    item.category,
    item.shortDescription,
    ...item.useCases,
    ...item.attachments
  ]
    .join(" ")
    .toLowerCase();

  const searchMatch = !search || haystack.includes(search);
  const categoryMatch = !filters.category || item.category === filters.category;
  const priceMatch = item.pricePerShift <= filters.maxPrice;
  const availabilityMatch = !filters.availability || item.availability === filters.availability;
  const attachmentMatch =
    !filters.attachment ||
    item.attachments.some((attachment) =>
      attachment.toLowerCase().includes(filters.attachment.toLowerCase())
    );
  const weightMatch = !filters.weight || roughWeightMatch(item, filters.weight);

  return searchMatch && categoryMatch && priceMatch && availabilityMatch && attachmentMatch && weightMatch;
}

function roughWeightMatch(item: Equipment, value: string) {
  const raw =
    String(item.specs["Эксплуатационная масса"] ?? item.specs["Масса"] ?? item.specs["Грузоподъемность"] ?? "");
  const number = Number(raw.replace(",", ".").match(/\d+(\.\d+)?/)?.[0] ?? 0);
  if (!number) return true;
  if (value === "до 3 т") return number <= 3;
  if (value === "3–10 т") return number > 3 && number <= 10;
  if (value === "более 10 т") return number > 10;
  return true;
}
