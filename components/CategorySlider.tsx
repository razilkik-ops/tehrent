import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { categories } from "@/lib/equipment";
import { CategoryCard } from "./CategoryCard";

const positions = [-2, -1, 0, 1, 2];

function wrapIndex(index: number) {
  return (index + categories.length) % categories.length;
}

export function CategorySlider() {
  const [active, setActive] = useState(2);

  return (
    <div className="relative mx-auto mt-8 max-w-none overflow-hidden px-8 py-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-[#f6f7f2] via-[#f6f7f2]/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-[#f6f7f2] via-[#f6f7f2]/70 to-transparent" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 xl:grid-cols-5 xl:items-center xl:gap-6">
        {positions.map((position) => {
          const category = categories[wrapIndex(active + position)];
          const isCenter = position === 0;
          const isOuter = Math.abs(position) === 2;

          return (
            <div
              key={`${category}-${position}`}
              className={`transition duration-500 ${
                isCenter
                  ? "z-10 scale-[1.04] opacity-100"
                  : isOuter
                    ? "scale-[0.94] opacity-[.62]"
                    : "scale-[0.98] opacity-[.88]"
              } ${position < 0 ? "origin-right" : position > 0 ? "origin-left" : ""} ${isOuter ? "hidden xl:block" : position !== 0 ? "hidden md:block" : ""}`}
            >
              <CategoryCard category={category} featured={isCenter} />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Предыдущая категория"
        onClick={() => setActive((value) => wrapIndex(value - 1))}
        className="absolute left-3 top-1/2 z-30 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-ink/10 bg-white/92 text-ink shadow-card transition hover:bg-accent"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        aria-label="Следующая категория"
        onClick={() => setActive((value) => wrapIndex(value + 1))}
        className="absolute right-3 top-1/2 z-30 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-ink/10 bg-white/92 text-ink shadow-card transition hover:bg-accent"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
