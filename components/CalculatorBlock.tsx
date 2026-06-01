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
    <section id="prices" className="w-full content-gutter py-12">
      <div className="mx-auto grid max-w-none overflow-hidden rounded-[22px] bg-white shadow-soft md:grid-cols-[0.98fr_1.02fr]">
        <div className="p-6 md:p-10 xl:p-12">
          <h2 className="text-[34px] font-black leading-tight">Рассчитайте стоимость аренды</h2>
          <div className="mt-5 h-px w-full bg-ink/8" />
          <div className="mt-8 grid gap-x-6 gap-y-6 md:grid-cols-[1.1fr_0.68fr_0.98fr]">
            <label className="grid gap-3 text-base font-black">
              Выберите технику
              <select
                className="focus-ring h-[62px] rounded-[8px] border border-ink/10 bg-white px-5 text-base font-bold shadow-[inset_0_0_0_1px_rgba(30,35,28,0.03)]"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-3 text-base font-black">
              Срок аренды
              <span className="relative block">
                <input
                  className="focus-ring h-[62px] w-full rounded-[8px] border border-ink/10 bg-white px-5 pr-12 text-base font-bold"
                  min={1}
                  type="number"
                  value={shifts}
                  onChange={(event) => setShifts(Number(event.target.value))}
                />
                <RotateCw className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/45" size={20} />
              </span>
            </label>
            <label className="grid gap-3 text-base font-black">
              Доставка
              <select className="focus-ring h-[62px] rounded-[8px] border border-ink/10 bg-white px-5 text-base font-bold">
                <option>В пределах Минска</option>
                <option>До 30 км от Минска</option>
                <option>По Беларуси</option>
              </select>
            </label>
            <label className="grid gap-3 text-base font-black md:col-span-1">
              Адрес объекта
              <span className="relative block">
                <input
                  className="focus-ring h-[62px] w-full rounded-[8px] border border-ink/10 bg-white px-5 pr-12 text-base font-bold"
                  placeholder="Минск, ул. Примерная, 1"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/45" size={22} />
              </span>
            </label>
            <label className="grid gap-3 text-base font-black">
              С оператором
              <span className="flex h-[62px] overflow-hidden rounded-[8px] border border-ink/10 bg-white p-1">
                {[
                  [true, "Да"],
                  [false, "Нет"]
                ].map(([value, label]) => (
                  <button
                    key={label as string}
                    type="button"
                    onClick={() => setOperator(Boolean(value))}
                    className={`flex-1 rounded-[6px] text-base font-black transition ${
                      operator === value ? "bg-night text-white shadow-card" : "text-ink/58"
                    }`}
                  >
                    {label as string}
                  </button>
                ))}
              </span>
            </label>
            <label className="mt-auto flex h-[62px] items-center gap-3 rounded-[8px] bg-white px-5 text-base font-black shadow-[inset_0_0_0_1px_rgba(30,35,28,0.08)]">
              <input
                className="size-6 rounded border-ink/12 accent-accent"
                checked={vat}
                type="checkbox"
                onChange={(event) => setVat(event.target.checked)}
              />
              Нужен НДС
            </label>
          </div>
          <Button href="#lead" className="mt-12 h-[70px] w-full rounded-[8px] text-lg font-black">
            Рассчитать стоимость
          </Button>
          <div className="mt-8 flex flex-wrap gap-7 text-base font-bold text-ink/54">
            {["Бесплатная отмена", "Фиксированные ставки", "Без скрытых платежей"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <Check size={18} className="text-moss" /> {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative isolate overflow-hidden rounded-[22px] bg-night p-6 text-white shadow-card md:p-10 xl:p-12">
          <span className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_35%,rgba(240,180,41,0.14),transparent_21rem)]" />
          <img
            src="/images/people/calculator-worker.png"
            alt=""
            className="absolute bottom-0 right-0 z-0 hidden h-[92%] object-contain object-bottom md:block"
          />
          <div className="relative z-10 max-w-[62%]">
            <h3 className="text-[28px] font-black leading-tight">Примерная стоимость аренды</h3>
            <p className="mt-10 text-[54px] font-black leading-none text-accent">
              {formatPrice(basePrice * shifts)} – {formatPrice(basePrice * shifts + 4500)}
            </p>
            <p className="mt-6 text-xl font-bold leading-8 text-white/72">
              Итоговая цена зависит от условий и может меняться
            </p>
            <dl className="mt-8 grid gap-3 text-lg font-bold text-white/68">
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <dt>{category}</dt>
                <dd>{formatPrice(basePrice)}</dd>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <dt>Смена {shifts * 8} ч</dt>
                <dd>{formatPrice(basePrice * shifts)}</dd>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <dt>Доставка</dt>
                <dd>{address.trim().length > 0 ? formatPrice(delivery) : "от 1 500 BYN"}</dd>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <dt>Оператор</dt>
                <dd>{operator ? "от 2 000 BYN" : "не нужен"}</dd>
              </div>
            </dl>
            <div className="mt-6 h-px bg-white/10" />
            <div className="mt-6 flex items-center justify-between gap-4 text-2xl font-black">
              <span>Итого</span>
              <span>от {formatPrice(total)}</span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-7">
              <Button href="#lead" className="h-[62px] rounded-[8px] px-10 text-lg font-black">
                Оформить заявку
              </Button>
              <button type="button" className="inline-flex items-center gap-3 text-base font-bold text-white/68">
                <FileDown size={24} /> Скачать расчет (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
