import { CheckCircle2, Phone } from "lucide-react";
import { availabilityLabels, formatPrice, type Equipment } from "@/lib/equipment";
import { Button } from "./Button";
import { EquipmentVisual } from "./EquipmentVisual";

const detailPrefixes: Record<string, string> = {
  "Мини-экскаваторы": "Мини-экскаватор",
  "Мини-погрузчики": "Мини-погрузчик",
  Автовышки: "Автовышка",
  Самосвалы: "Самосвал",
  Катки: "Каток",
  "Навесное оборудование": "Навесное оборудование"
};

export function EquipmentDetailHero({ item }: { item: Equipment }) {
  return (
    <section className="container-page pt-6 md:pt-8">
      <nav className="text-xs text-ink/48">
        Главная / Техника / {item.category} / <span className="text-ink">{item.title}</span>
      </nav>
      <div className="mt-5">
        <h1 className="max-w-4xl text-[34px] font-black leading-tight tracking-normal md:text-[40px]">
          {detailPrefixes[item.category] ?? item.category} {item.title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/68">{item.shortDescription}</p>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-[1.55fr_0.95fr]">
        <div className="rounded-[22px] bg-white p-3 shadow-soft">
          <EquipmentVisual
            type={item.imagePlaceholderType}
            imageUrl={item.imageUrl}
            className="min-h-[300px] rounded-[18px] md:min-h-[360px]"
            priorityLabel="1 / 6"
          />
          <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <EquipmentVisual
                key={index}
                type={item.imagePlaceholderType}
                imageUrl={item.imageUrl}
                className={`min-h-20 rounded-xl ${index === 0 ? "ring-3 ring-accent" : ""}`}
              />
            ))}
          </div>
        </div>
        <aside className="rounded-[22px] bg-white p-6 shadow-soft md:p-7">
          <span className="rounded-full bg-moss/12 px-3 py-1 text-sm font-bold text-moss">
            {availabilityLabels[item.availability]}
          </span>
          <div className="mt-6">
            <p className="text-3xl font-black">от {formatPrice(item.pricePerShift)}/смена</p>
            <p className="mt-3 text-sm leading-6 text-ink/62">
              Смена 8 часов. Оператор, доставка и навесное оборудование рассчитываются под объект.
            </p>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4">
            {Object.entries(item.specs)
              .slice(0, 6)
              .map(([key, value]) => (
                <div key={key}>
                  <dt className="text-xs font-bold text-ink/48">{key}</dt>
                  <dd className="mt-1 text-base font-black">{value}</dd>
                </div>
              ))}
          </dl>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button href="#equipment-lead">Заказать</Button>
            <Button href="tel:+3752920958258" variant="dark" className="gap-2">
              <Phone size={17} /> Позвонить
            </Button>
          </div>
          <p className="mt-7 flex items-center gap-2 text-sm text-ink/58">
            <CheckCircle2 className="text-accent" size={18} />
            Техника застрахована и проходит регулярное ТО.
          </p>
        </aside>
      </div>
    </section>
  );
}
