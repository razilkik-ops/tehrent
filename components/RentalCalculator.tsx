import { Calculator, Check, Clock3, Info, Ruler, Truck, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "./Button";
import { useOrderModal } from "./OrderModal";

const DELIVERY_BASE_PRICE = 180;
const DELIVERY_KM_PRICE = 3;
const BASE_HOURLY_PRICE = 85;
const ATTACHMENT_HOURLY_PRICE = 120;
const MIN_HOURS = 0;

type RentalCalculatorProps = {
  className?: string;
  id?: string;
  sourcePage?: string;
};

function formatRub(value: number) {
  return new Intl.NumberFormat("ru-BY").format(value) + " руб";
}

export function RentalCalculator({ className = "", id, sourcePage = "calculator" }: RentalCalculatorProps) {
  const { openOrderModal } = useOrderModal();
  const [hours, setHours] = useState(String(MIN_HOURS));
  const [distanceKm, setDistanceKm] = useState("0");
  const [hydroDrill, setHydroDrill] = useState(false);
  const [hydraulicHammer, setHydraulicHammer] = useState(false);

  const attachmentSelected = hydroDrill || hydraulicHammer;
  const hourlyPrice = attachmentSelected ? ATTACHMENT_HOURLY_PRICE : BASE_HOURLY_PRICE;

  const totals = useMemo(() => {
    const parsedHours = Number(hours);
    const parsedDistance = Number(distanceKm);
    const safeHours = Math.max(0, Number.isFinite(parsedHours) ? parsedHours : MIN_HOURS);
    const safeDistance = Math.max(0, Number.isFinite(parsedDistance) ? parsedDistance : 0);
    const delivery = DELIVERY_BASE_PRICE + safeDistance * DELIVERY_KM_PRICE;
    const work = safeHours * hourlyPrice;

    return {
      delivery,
      work,
      total: delivery + work
    };
  }, [distanceKm, hourlyPrice, hours]);

  return (
    <section id={id} className={`rounded-[16px] bg-night p-4 text-white shadow-soft md:rounded-[20px] md:p-6 ${className}`}>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-accent text-night">
              <Calculator size={22} />
            </span>
            <div>
              <p className="text-xs font-black uppercase text-accent">Калькулятор аренды</p>
              <h2 className="mt-1 text-2xl font-black leading-tight md:text-[34px]">Рассчитайте стоимость</h2>
            </div>
          </div>

          <div className="mt-5 grid gap-2 text-sm font-black leading-5 text-white/82 md:grid-cols-2">
            <div className="flex items-start gap-2 rounded-[12px] border border-white/10 bg-white/8 px-3 py-3">
              <Truck size={17} className="mt-0.5 shrink-0 text-accent" />
              <span>Доставка: Минск {formatRub(DELIVERY_BASE_PRICE)} + {formatRub(DELIVERY_KM_PRICE)} за 1 км от МКАД</span>
            </div>
            <div className="flex items-start gap-2 rounded-[12px] border border-white/10 bg-white/8 px-3 py-3">
              <Clock3 size={17} className="mt-0.5 shrink-0 text-accent" />
              <span>Работа: {formatRub(BASE_HOURLY_PRICE)}/час</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-black text-white/74">
                <Clock3 size={17} className="text-accent" />
                Часы работы
              </span>
              <input
                type="number"
                min={MIN_HOURS}
                step={1}
                value={hours}
                onFocus={() => hours === "0" && setHours("")}
                onBlur={() => hours === "" && setHours("0")}
                onChange={(event) => setHours(event.target.value)}
                className="focus-ring h-14 w-full rounded-[12px] border border-white/10 bg-white/10 px-4 text-xl font-black text-white outline-none placeholder:text-white/38"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-black text-white/74">
                <Ruler size={17} className="text-accent" />
                Км от МКАД
              </span>
              <input
                type="number"
                min={0}
                step={1}
                value={distanceKm}
                onFocus={() => distanceKm === "0" && setDistanceKm("")}
                onBlur={() => distanceKm === "" && setDistanceKm("0")}
                onChange={(event) => setDistanceKm(event.target.value)}
                className="focus-ring h-14 w-full rounded-[12px] border border-white/10 bg-white/10 px-4 text-xl font-black text-white outline-none placeholder:text-white/38"
              />
            </label>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              {
                checked: hydroDrill,
                label: "Гидробур",
                onChange: setHydroDrill
              },
              {
                checked: hydraulicHammer,
                label: "Гидромолот",
                onChange: setHydraulicHammer
              }
            ].map((item) => (
              <label
                key={item.label}
                className="flex min-h-[62px] cursor-pointer items-center gap-3 rounded-[12px] border border-white/10 bg-white/8 px-4 transition hover:bg-white/12"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(event) => item.onChange(event.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-[8px] border ${
                    item.checked ? "border-accent bg-accent text-night" : "border-white/24 bg-white/8 text-transparent"
                  }`}
                >
                  <Check size={17} strokeWidth={3} />
                </span>
                <span className="flex items-center gap-2 text-base font-black">
                  <Wrench size={17} className="text-accent" />
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-[14px] bg-white p-4 text-ink md:p-5">
          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-4 rounded-[12px] bg-paper px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-black text-ink/58">
                <Truck size={17} className="text-accent" />
                Доставка
              </span>
              <span className="text-lg font-black">{formatRub(totals.delivery)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-[12px] bg-paper px-4 py-3">
              <span className="text-sm font-black text-ink/58">Работа, {formatRub(hourlyPrice)}/час</span>
              <span className="text-lg font-black">{formatRub(totals.work)}</span>
            </div>
          </div>

          <div className="mt-5 border-t border-ink/10 pt-5">
            <p className="text-sm font-black uppercase text-accent">Итого ориентировочно</p>
            <p className="mt-1 text-[34px] font-black leading-none text-ink md:text-[42px]">{formatRub(totals.total)}</p>
          </div>

          <p className="mt-4 flex gap-2 rounded-[12px] bg-accent/12 px-4 py-3 text-sm font-semibold leading-5 text-ink/68">
            <Info size={17} className="mt-0.5 shrink-0 text-accent" />
            Расчет приблизительный. Точная сумма согласуется по телефону.
          </p>

          <Button
            type="button"
            className="mt-5 h-12 w-full rounded-[10px] text-base font-black uppercase"
            onClick={() =>
              openOrderModal({
                sourcePage,
                formType: "calculator-order",
                hiddenTask: `Заявка из калькулятора. Ориентировочно: ${formatRub(totals.total)}. Часы: ${hours || "0"}, км от МКАД: ${distanceKm || "0"}.`
              })
            }
          >
            Заказать
          </Button>
        </div>
      </div>
    </section>
  );
}
