import { Check, Heart, MapPin, Plus, Ruler, Weight } from "lucide-react";
import { availabilityLabels, formatPrice, type Equipment } from "@/lib/equipment";
import { Button } from "./Button";
import { EquipmentVisual } from "./EquipmentVisual";

type EquipmentCardProps = {
  item: Equipment;
  selected?: boolean;
  onToggleSelected?: (id: string) => void;
  onRequest?: (id: string) => void;
};

export function EquipmentCard({ item, selected, onToggleSelected, onRequest }: EquipmentCardProps) {
  return (
    <article className="overflow-hidden rounded-[12px] border border-ink/8 bg-white shadow-card">
      <div className="relative">
        <a href={`/equipment/${item.slug}`}>
          <EquipmentVisual
            type={item.imagePlaceholderType}
            className="h-[102px] !min-h-0 rounded-none xl:h-[128px] 2xl:h-[136px]"
            priorityLabel={availabilityLabels[item.availability]}
          />
        </a>
        {onToggleSelected ? (
          <button
            type="button"
            className={`focus-ring absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border transition ${
              selected
                ? "border-accent bg-accent text-night"
                : "border-ink/10 bg-white/90 text-ink hover:bg-accent"
            }`}
            onClick={() => onToggleSelected(item.id)}
            aria-label="Добавить в сравнение"
          >
            {selected ? <Check size={18} /> : <Heart size={18} />}
          </button>
        ) : null}
      </div>
      <div className="p-4 md:p-2 xl:p-3">
        <div className="flex items-start justify-between gap-3">
          <a href={`/equipment/${item.slug}`} className="text-[13px] font-black hover:text-moss xl:text-[15px]">
            {item.title}
          </a>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[8px] font-semibold text-ink/58 xl:mt-1.5 xl:gap-x-2.5 xl:gap-y-1.5 xl:text-[9px]">
          <span className="inline-flex items-center gap-1.5">
            <Weight className="size-3" /> {item.specs["Эксплуатационная масса"] || item.specs["Масса"] || item.specs["Грузоподъемность"]}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Ruler className="size-3" /> {item.specs["Глубина копания"] || item.specs["Высота подъема"] || item.specs["Ширина"]}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3" /> {item.attachments[0]}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 md:mt-1 md:gap-1.5 xl:mt-2">
          {["С оператором", "Доставка"].map((tag) => (
            <span key={tag} className="rounded-full bg-[#dff0d6]/80 px-2 py-0.5 text-[8px] font-black text-moss xl:text-[9px]">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-1.5 flex items-end justify-between gap-3 xl:mt-3">
          <div>
            <span className="text-[9px] text-ink/52 xl:text-[10px]">от</span>
            <p className="text-xs font-black xl:text-sm">{formatPrice(item.pricePerShift)}/смена</p>
          </div>
          <Button
            size="sm"
            type="button"
            onClick={() => onRequest?.(item.id)}
            className="h-6 rounded-[7px] px-3 text-[10px] xl:h-8 xl:rounded-[8px] xl:px-3 xl:text-[10px]"
          >
            <Plus className="size-3 xl:size-4" /> В заявку
          </Button>
        </div>
      </div>
    </article>
  );
}
