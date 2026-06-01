import { Check, ChevronDown, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { availabilityLabels, formatPrice, type Equipment } from "@/lib/equipment";
import { Button } from "./Button";
import { EquipmentVisual } from "./EquipmentVisual";

type EquipmentCompareProps = {
  items: Equipment[];
  selectedIds: Array<string | null>;
  onSelect: (slotIndex: number, id: string | null) => void;
  onClear: () => void;
};

const rows = ["Масса", "Глубина копания", "Навесное", "Цена от", "Статус"];

export function EquipmentCompare({ items, selectedIds, onSelect, onClear }: EquipmentCompareProps) {
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const selectedItems = selectedIds.map((id) => items.find((item) => item.id === id) ?? null);
  const selectedCount = selectedItems.filter(Boolean).length;

  return (
    <section className="overflow-hidden rounded-[16px] bg-white shadow-card xl:rounded-[18px]">
      <div className="flex flex-col gap-2 border-b border-ink/8 p-4 sm:flex-row sm:items-center sm:justify-between xl:p-6">
        <h2 className="text-xl font-black xl:text-2xl">
          Сравнение техники{" "}
          <span className="ml-2 rounded-full bg-accent px-3 py-1 text-sm xl:text-base">{selectedCount}/2</span>
        </h2>
        <button
          type="button"
          onClick={() => {
            onClear();
            setOpenSlot(null);
          }}
          className="inline-flex items-center gap-2 text-sm font-bold text-ink/62 transition hover:text-ink"
        >
          Очистить <Trash2 size={16} />
        </button>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-2 xl:gap-5 xl:p-6">
        {[0, 1].map((slotIndex) => {
          const item = selectedItems[slotIndex];

          return (
            <div
              key={slotIndex}
              className={`relative rounded-[16px] border bg-paper/45 p-4 transition ${
                item ? "border-ink/10" : "border-dashed border-ink/16"
              }`}
            >
              {item ? (
                <SelectedSlot
                  item={item}
                  onChange={() => setOpenSlot(openSlot === slotIndex ? null : slotIndex)}
                  onRemove={() => onSelect(slotIndex, null)}
                />
              ) : (
                <EmptySlot
                  slotNumber={slotIndex + 1}
                  onOpen={() => setOpenSlot(openSlot === slotIndex ? null : slotIndex)}
                />
              )}

              {openSlot === slotIndex ? (
                <EquipmentPicker
                  items={items}
                  activeId={item?.id}
                  selectedIds={selectedIds}
                  onSelect={(id) => {
                    onSelect(slotIndex, id);
                    setOpenSlot(null);
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {selectedCount ? (
        <div className="mx-4 overflow-hidden rounded-[14px] border border-ink/8 xl:mx-6">
          {rows.map((row) => (
            <div key={row} className="grid grid-cols-[120px_1fr_1fr] border-b border-ink/8 last:border-b-0 xl:grid-cols-[190px_1fr_1fr]">
              <div className="bg-paper px-3 py-3 text-sm font-black xl:px-5 xl:py-4">{row}</div>
              {selectedItems.map((item, index) => (
                <div key={`${row}-${index}`} className="border-l border-ink/8 px-3 py-3 text-center text-sm font-semibold text-ink/78 xl:px-5 xl:py-4">
                  {item ? compareValue(row, item) : <span className="text-ink/30">Не выбрано</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : null}

      <div className="p-4 text-center xl:p-6">
        {selectedCount ? (
          <Button href="#catalog-lead" variant="outline" className="h-11 rounded-[10px] px-8 text-sm">
            Передать выбранное в заявку
          </Button>
        ) : (
          <span className="inline-flex h-11 items-center justify-center rounded-[10px] border border-ink/10 px-8 text-sm font-bold text-ink/36">
            Передать выбранное в заявку
          </span>
        )}
      </div>
    </section>
  );
}

function EmptySlot({ slotNumber, onOpen }: { slotNumber: number; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="focus-ring flex min-h-[190px] w-full flex-col items-center justify-center rounded-[13px] bg-white text-center transition hover:bg-accent/8 xl:min-h-[220px]"
    >
      <span className="grid size-14 place-items-center rounded-full bg-accent text-ink shadow-soft">
        <Plus size={26} strokeWidth={3} />
      </span>
      <span className="mt-4 text-lg font-black">Ячейка {slotNumber}</span>
      <span className="mt-1 max-w-[230px] text-sm font-semibold leading-5 text-ink/55">
        Нажмите плюс, чтобы выбрать технику для сравнения.
      </span>
    </button>
  );
}

function SelectedSlot({
  item,
  onChange,
  onRemove
}: {
  item: Equipment;
  onChange: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-[150px_1fr] xl:grid-cols-[180px_1fr]">
      <EquipmentVisual
        type={item.imagePlaceholderType}
        priorityLabel={availabilityLabels[item.availability]}
        className="h-[150px] !min-h-0 rounded-[12px] xl:h-[168px]"
      />
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.06em] text-moss">{item.category}</p>
            <h3 className="mt-1 text-xl font-black leading-tight xl:text-2xl">{item.title}</h3>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="focus-ring grid size-8 shrink-0 place-items-center rounded-full bg-white text-ink/54 transition hover:bg-ink hover:text-white"
            aria-label="Убрать из сравнения"
          >
            <X size={17} />
          </button>
        </div>
        <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-ink/58">{item.shortDescription}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#dff0d6] px-3 py-1 text-xs font-black text-moss">
            {availabilityLabels[item.availability]}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-ink/58">
            {formatPrice(item.pricePerShift)}/смена
          </span>
        </div>
        <button
          type="button"
          onClick={onChange}
          className="focus-ring mt-4 inline-flex h-10 items-center gap-2 rounded-[10px] border border-ink/12 bg-white px-4 text-sm font-black transition hover:border-accent hover:bg-accent/10"
        >
          Изменить <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}

function EquipmentPicker({
  items,
  activeId,
  selectedIds,
  onSelect
}: {
  items: Equipment[];
  activeId?: string;
  selectedIds: Array<string | null>;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-4 max-h-[280px] overflow-auto rounded-[14px] border border-ink/10 bg-white p-2 shadow-soft">
      {items.map((item) => {
        const alreadyInOtherSlot = selectedIds.includes(item.id) && item.id !== activeId;

        return (
          <button
            key={item.id}
            type="button"
            disabled={alreadyInOtherSlot}
            onClick={() => onSelect(item.id)}
            className="focus-ring flex w-full items-center justify-between gap-4 rounded-[10px] px-3 py-3 text-left transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-45"
          >
            <span>
              <span className="block text-sm font-black">{item.title}</span>
              <span className="mt-0.5 block text-xs font-semibold text-ink/52">
                {item.category} · {formatPrice(item.pricePerShift)}/смена
              </span>
            </span>
            {item.id === activeId ? <Check className="size-5 shrink-0 text-moss" /> : null}
          </button>
        );
      })}
    </div>
  );
}

function compareValue(row: string, item: Equipment) {
  if (row === "Масса") {
    return item.specs["Эксплуатационная масса"] || item.specs["Масса"] || item.specs["Грузоподъемность"] || "—";
  }

  if (row === "Глубина копания") {
    return item.specs["Глубина копания"] || item.specs["Высота подъема"] || "—";
  }

  if (row === "Навесное") {
    return item.attachments.slice(0, 2).join(", ");
  }

  if (row === "Цена от") {
    return `${formatPrice(item.pricePerShift)}/смена`;
  }

  if (row === "Статус") {
    return availabilityLabels[item.availability];
  }

  return "—";
}
