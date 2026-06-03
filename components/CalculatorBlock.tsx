import { Check, FileDown, MapPin, RotateCw } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, equipment, formatPrice } from "@/lib/equipment";
import { Button } from "./Button";

export function CalculatorBlock() {
  const [category, setCategory] = useState(categories[0]);
  const [shifts, setShifts] = useState(1);
  const [operator, setOperator] = useState(true);
  const [vat, setVat] = useState(false);
  const [address, setAddress] = useState("");

  const basePrice = useMemo(() => {
    if (category === "Мини-экскаваторы") return 12000;
    const items = equipment.filter((item) => item.category === category);
    return Math.min(...items.map((item) => item.pricePerShift));
  }, [category]);

  const delivery = address.trim().length > 0 ? 3000 : 500;
  const operatorCost = operator ? 0 : -1500;
  const vatCost = vat ? 2500 : 0;
  const total = Math.max(basePrice * shifts + delivery + operatorCost + vatCost, 0);

  return (
    <section id="prices" className="w-full content-gutter py-8 md:py-12">
      <div className="mx-auto grid max-w-none overflow-hidden rounded-[16px] bg-white shadow-soft md:grid-cols-[0.98fr_1.02fr] md:rounded-[22px]">
        <div className="p-4 md:p-10 xl:p-12">
          <h2 className="text-[28px] font-black leading-tight md:text-[34px]">Рассчитайте стоимость аренды</h2>
          <div className="mt-4 h-px w-full bg-ink/8 md:mt-5" />
          <div className="mt-5 grid gap-x-6 gap-y-4 md:mt-8 md:grid-cols-[1.1fr_0.68fr_0.98fr] md:gap-y-6">
            <label className="grid gap-2 text-sm font-black md:gap-3 md:text-base">
              Выберите технику
              <select
                className="focus-ring h-12 rounded-[8px] border border-ink/10 bg-white px-4 text-sm font-bold shadow-[inset_0_0_0_1px_rgba(30,35,28,0.03)] md:h-[62px] md:px-5 md:text-base"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-black md:gap-3 md:text-base">
              Срок аренды
              <span className="relative block">
                <input
                  className="focus-ring h-12 w-full rounded-[8px] border border-ink/10 bg-white px-4 pr-10 text-sm font-bold md:h-[62px] md:px-5 md:pr-12 md:text-base"
                  min={1}
                  type="number"
                  value={shifts}
                  onChange={(event) => setShifts(Number(event.target.value))}
                />
                <RotateCw className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/45 md:right-4" size={18} />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-black md:gap-3 md:text-base">
              Доставка
              <select className="focus-ring h-12 rounded-[8px] border border-ink/10 bg-white px-4 text-sm font-bold md:h-[62px] md:px-5 md:text-base">
                <option>В пределах Минска</option>
                <option>До 30 км от Минска</option>
                <option>По Беларуси</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-black md:col-span-1 md:gap-3 md:text-base">
              Адрес объекта
              <span className="relative block">
                <input
                  className="focus-ring h-12 w-full rounded-[8px] border border-ink/10 bg-white px-4 pr-10 text-sm font-bold md:h-[62px] md:px-5 md:pr-12 md:text-base"
                  placeholder="Минск, ул. Примерная, 1"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/45 md:right-4" size={19} />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-black md:gap-3 md:text-base">
              С оператором
              <span className="flex h-12 overflow-hidden rounded-[8px] border border-ink/10 bg-white p-1 md:h-[62px]">
                {[
                  [true, "Да"],
                  [false, "Нет"]
                ].map(([value, label]) => (
                  <button
                    key={label as string}
                    type="button"
                    onClick={() => setOperator(Boolean(value))}
                    className={`flex-1 rounded-[6px] text-sm font-black transition md:text-base ${
                      operator === value ? "bg-night text-white shadow-card" : "text-ink/58"
                    }`}
                  >
                    {label as string}
                  </button>
                ))}
              </span>
            </label>
            <label className="mt-auto flex h-12 items-center gap-2 rounded-[8px] bg-white px-4 text-sm font-black shadow-[inset_0_0_0_1px_rgba(30,35,28,0.08)] md:h-[62px] md:gap-3 md:px-5 md:text-base">
              <input
                className="size-5 rounded border-ink/12 accent-accent md:size-6"
                checked={vat}
                type="checkbox"
                onChange={(event) => setVat(event.target.checked)}
              />
              Нужен НДС
            </label>
          </div>
          <Button href="#mobile-lead" className="mt-6 h-12 w-full rounded-[8px] text-sm font-black md:mt-12 md:h-[70px] md:text-lg">
            Рассчитать стоимость
          </Button>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-ink/54 md:mt-8 md:gap-7 md:text-base">
            {["Бесплатная отмена", "Фиксированные ставки", "Без скрытых платежей"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <Check size={16} className="text-moss md:size-[18px]" /> {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative isolate overflow-hidden rounded-[16px] bg-night p-4 text-white shadow-card md:rounded-[22px] md:p-10 xl:p-12">
          <span className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_35%,rgba(240,180,41,0.14),transparent_21rem)]" />
          <img
            src="/images/people/calculator-worker.png"
            alt=""
            className="absolute bottom-0 right-0 z-0 hidden h-[92%] object-contain object-bottom md:block"
          />
          <div className="relative z-10 md:max-w-[62%]">
            <h3 className="text-[22px] font-black leading-tight md:text-[28px]">Примерная стоимость аренды</h3>
            <div className="mt-4 grid grid-cols-2 gap-2 md:hidden">
              <div className="rounded-[10px] bg-white/8 p-3">
                <span className="text-[11px] font-bold uppercase text-white/48">от</span>
                <p className="mt-1 text-[22px] font-black leading-none text-accent">{formatPrice(basePrice * shifts)}</p>
              </div>
              <div className="rounded-[10px] bg-white/8 p-3">
                <span className="text-[11px] font-bold uppercase text-white/48">до</span>
                <p className="mt-1 text-[22px] font-black leading-none text-accent">{formatPrice(basePrice * shifts + 4500)}</p>
              </div>
            </div>
            <p className="mt-5 hidden text-[32px] font-black leading-none text-accent md:mt-10 md:block md:text-[54px]">
              {formatPrice(basePrice * shifts)} – {formatPrice(basePrice * shifts + 4500)}
            </p>
            <p className="mt-3 text-sm font-bold leading-6 text-white/72 md:mt-6 md:text-xl md:leading-8">
              Итоговая цена зависит от условий и может меняться
            </p>
            <dl className="mt-5 grid gap-2 text-xs font-bold text-white/68 md:mt-8 md:gap-3 md:text-lg">
              <div className="grid gap-1 rounded-[8px] bg-white/6 px-3 py-2 md:grid-cols-[1fr_auto] md:gap-4 md:bg-transparent md:p-0">
                <dt>{category}</dt>
                <dd className="font-black text-white/86">{formatPrice(basePrice)}</dd>
              </div>
              <div className="grid gap-1 rounded-[8px] bg-white/6 px-3 py-2 md:grid-cols-[1fr_auto] md:gap-4 md:bg-transparent md:p-0">
                <dt>Смена {shifts * 8} ч</dt>
                <dd className="font-black text-white/86">{formatPrice(basePrice * shifts)}</dd>
              </div>
              <div className="grid gap-1 rounded-[8px] bg-white/6 px-3 py-2 md:grid-cols-[1fr_auto] md:gap-4 md:bg-transparent md:p-0">
                <dt>Доставка</dt>
                <dd className="font-black text-white/86">{address.trim().length > 0 ? formatPrice(delivery) : "от 1 500 BYN"}</dd>
              </div>
              <div className="grid gap-1 rounded-[8px] bg-white/6 px-3 py-2 md:grid-cols-[1fr_auto] md:gap-4 md:bg-transparent md:p-0">
                <dt>Оператор</dt>
                <dd className="font-black text-white/86">{operator ? "от 2 000 BYN" : "не нужен"}</dd>
              </div>
            </dl>
            <div className="mt-4 h-px bg-white/10 md:mt-6" />
            <div className="mt-4 flex items-start justify-between gap-3 text-base font-black md:mt-6 md:items-center md:gap-4 md:text-2xl">
              <span>Итого</span>
              <span className="text-right text-accent md:text-white">от {formatPrice(total)}</span>
            </div>
            <div className="mt-5 grid gap-3 md:mt-8 md:flex md:flex-wrap md:items-center md:gap-7">
              <Button href="#mobile-lead" className="h-11 w-full rounded-[8px] px-5 text-sm font-black md:h-[62px] md:w-auto md:px-10 md:text-lg">
                Оформить заявку
              </Button>
              <button type="button" className="inline-flex items-center justify-center gap-2 text-xs font-bold text-white/58 md:justify-start md:gap-3 md:text-base md:text-white/68">
                <FileDown size={20} className="md:size-6" /> Скачать расчет (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
