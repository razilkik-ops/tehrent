import { SlidersHorizontal, X } from "lucide-react";
import { categories } from "@/lib/equipment";

export type CatalogFilters = {
  category: string;
  search: string;
  maxPrice: number;
  availability: string;
  attachment: string;
  term: string;
  weight: string;
};

type EquipmentFiltersProps = {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  onReset: () => void;
};

export function EquipmentFilters({ filters, onChange, onReset }: EquipmentFiltersProps) {
  function setValue<K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <aside className="rounded-[14px] border border-ink/8 bg-white p-3 shadow-card md:sticky md:top-20 xl:rounded-[18px] xl:p-6 xl:top-24">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black xl:text-[24px]">Фильтры</h2>
        <button
          type="button"
          onClick={onReset}
          className="focus-ring inline-flex items-center gap-1 text-[10px] font-bold text-ink/54 xl:text-xs"
        >
          <X size={14} /> Сбросить
        </button>
      </div>
      <div className="mt-4 grid gap-4 xl:mt-7 xl:gap-7">
        <fieldset>
          <legend className="text-xs font-black xl:text-sm">Рабочая глубина</legend>
          <div className="mt-3 grid gap-2 xl:mt-4 xl:gap-3">
            {["До 2 м", "2–3 м", "3–4 м", "Более 4 м"].map((item) => (
              <label key={item} className="flex items-center gap-2.5 text-[11px] font-semibold text-ink/70 xl:gap-3 xl:text-sm">
                <input className="size-3.5 rounded border-ink/15 accent-accent xl:size-4" type="checkbox" /> {item}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-xs font-black xl:text-sm">Масса, т</legend>
          <input
            min={0}
            max={50}
            type="range"
            className="mt-2.5 w-full accent-accent xl:mt-4"
            value={filters.weight === "более 10 т" ? 50 : filters.weight === "3–10 т" ? 10 : 3}
            onChange={(event) => {
              const value = Number(event.target.value);
              setValue("weight", value <= 3 ? "до 3 т" : value <= 10 ? "3–10 т" : "более 10 т");
            }}
          />
          <div className="mt-2 grid grid-cols-2 gap-2 xl:mt-3 xl:gap-3">
            <span className="rounded-[8px] border border-ink/10 px-2 py-1.5 text-[11px] font-semibold text-ink/58 xl:px-3 xl:py-2 xl:text-sm">от 1</span>
            <span className="rounded-[8px] border border-ink/10 px-2 py-1.5 text-[11px] font-semibold text-ink/58 xl:px-3 xl:py-2 xl:text-sm">до 50</span>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-xs font-black xl:text-sm">Цена, BYN/смена</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 xl:mt-3 xl:gap-3">
            <span className="rounded-[8px] border border-ink/10 px-2 py-1.5 text-[11px] font-semibold leading-4 text-ink/58 xl:px-3 xl:py-2 xl:text-sm">от 2 000</span>
            <span className="rounded-[8px] border border-ink/10 px-2 py-1.5 text-[11px] font-semibold leading-4 text-ink/58 xl:px-3 xl:py-2 xl:text-sm">до 20 000</span>
          </div>
          <input
            min={7000}
            max={20000}
            step={500}
            type="range"
            value={filters.maxPrice}
            onChange={(event) => setValue("maxPrice", Number(event.target.value))}
            className="mt-2.5 w-full accent-accent xl:mt-4"
          />
        </fieldset>

        <fieldset>
          <legend className="text-xs font-black xl:text-sm">Тип привода</legend>
          <div className="mt-3 grid gap-2 xl:mt-4 xl:gap-3">
            {["Гусеничный", "Колёсный"].map((item) => (
              <label key={item} className="flex items-center gap-2.5 text-[11px] font-semibold text-ink/70 xl:gap-3 xl:text-sm">
                <input className="size-3.5 rounded border-ink/15 accent-accent xl:size-4" type="checkbox" /> {item}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-xs font-black xl:text-sm">Дополнительно</legend>
          <div className="mt-3 grid gap-2 xl:mt-4 xl:gap-3">
            {[
              ["С оператором", "term", "1 смена"],
              ["Доставка", "availability", "today"],
              ["Гидромолот", "attachment", "Гидромолот"],
              ["Быстросъём", "attachment", "Ковш"],
              ["Узкий корпус", "search", "узкий"]
            ].map(([label, key, value]) => (
              <label key={label} className="flex items-center gap-2.5 text-[11px] font-semibold text-ink/70 xl:gap-3 xl:text-sm">
                <input
                  className="size-3.5 rounded border-ink/15 accent-accent xl:size-4"
                  type="checkbox"
                  onChange={(event) =>
                    setValue(key as keyof CatalogFilters, (event.target.checked ? value : "") as never)
                  }
                />{" "}
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <button
        type="button"
        className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-ink/10 bg-paper text-[11px] font-black text-ink xl:mt-8 xl:h-14 xl:text-base"
      >
        <SlidersHorizontal size={17} /> Показать {filters.maxPrice >= 20000 ? "24" : ""} единицы
      </button>
    </aside>
  );
}
