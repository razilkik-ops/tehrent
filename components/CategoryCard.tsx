import { ArrowRight } from "lucide-react";
import { type ImagePlaceholderType } from "@/lib/equipment";
import { EquipmentVisual } from "./EquipmentVisual";

const categoryMeta: Record<
  string,
  {
    visual: ImagePlaceholderType;
    badge: string;
    title: string;
    text: string;
    price: string;
  }
> = {
  "Мини-экскаваторы": {
    visual: "excavator",
    badge: "В наличии",
    title: "Мини-экскаваторы 1,5‑8\u00A0т",
    text: "Идеально для копки, траншей, фундаментов",
    price: "от 6 000 BYN/смена"
  },
  Погрузчики: {
    visual: "loader",
    badge: "В наличии",
    title: "Мини-погрузчики",
    text: "Погрузка, планировка, уборка территории",
    price: "от 5 500 BYN/смена"
  },
  Автовышки: {
    visual: "lift",
    badge: "В наличии",
    title: "Автовышки 12‑28\u00A0м",
    text: "Работы на высоте, монтаж оборудования",
    price: "от 12 000 BYN/смена"
  },
  Самосвалы: {
    visual: "truck",
    badge: "В наличии",
    title: "Самосвалы 10‑20\u00A0т",
    text: "Вывоз грунта, сыпучих материалов",
    price: "от 10 000 BYN/смена"
  },
  Катки: {
    visual: "loader",
    badge: "Под заказ",
    title: "Вилочные погрузчики",
    text: "Погрузка/разгрузка, складские работы",
    price: "от 6 000 BYN/смена"
  },
  "Навесное оборудование": {
    visual: "excavator",
    badge: "В наличии",
    title: "Гидромолоты и навесное",
    text: "Демонтаж, бурение, дробление",
    price: "от 7 000 BYN/смена"
  }
};

type CategoryCardProps = {
  category: string;
  className?: string;
  featured?: boolean;
};

export function CategoryCard({ category, className = "", featured = false }: CategoryCardProps) {
  const meta = categoryMeta[category] ?? categoryMeta["Погрузчики"];

  return (
    <a
      href={`/catalog?category=${encodeURIComponent(category)}`}
      className={`group block h-full overflow-hidden rounded-[16px] border border-ink/8 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft ${className}`}
    >
      <EquipmentVisual
        type={meta.visual}
        className={`${featured ? "h-[224px]" : "h-[214px]"} min-h-0 rounded-none transition-[height] duration-300`}
        priorityLabel={meta.badge}
      />
      <div className={`${featured ? "p-5" : "p-5"} transition-[padding] duration-300`}>
        <h3 className={`${featured ? "min-h-[58px] text-[24px]" : "min-h-[56px] text-[23px]"} text-wrap font-black leading-[1.14]`}>
          {meta.title}
        </h3>
        <p className="mt-3 min-h-[60px] border-y border-ink/8 py-3 text-[16px] font-semibold leading-6 text-ink/60">
          {meta.text}
        </p>
        <p className={`${featured ? "text-xl" : "text-xl"} mt-5 font-black leading-tight`}>{meta.price}</p>
        <span className={`${featured ? "h-[56px]" : "h-[54px]"} mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-accent text-lg font-black transition group-hover:bg-night group-hover:text-white`}>
          Подробнее <ArrowRight size={18} className="opacity-0 transition group-hover:opacity-100" />
        </span>
      </div>
    </a>
  );
}
