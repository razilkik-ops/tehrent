import { BadgeCheck, Clock3, ShieldCheck } from "lucide-react";
import { CatalogPageClient } from "@/components/CatalogPageClient";
import { Button } from "@/components/Button";
import { EquipmentVisual } from "@/components/EquipmentVisual";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { usePageMeta } from "@/src/usePageMeta";

export function CatalogPage() {
  usePageMeta(
    "Каталог спецтехники в аренду | ТехПрокат",
    "Каталог мини-экскаваторов, погрузчиков, автовышек, самосвалов и навесного оборудования в аренду."
  );

  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("category") ?? "";

  return (
    <>
      <Header />
      <main>
        <section className="w-full content-gutter pt-3 md:pt-0">
          <div className="grid overflow-hidden rounded-[14px] bg-white shadow-soft md:h-[236px] md:grid-cols-[0.62fr_1fr] xl:h-[300px] xl:grid-cols-[0.58fr_1.42fr]">
            <div className="flex h-full flex-col justify-center p-6 md:p-7 xl:p-8">
              <h1 className="text-[38px] font-black leading-tight tracking-normal md:text-[32px] xl:text-[44px]">
                Каталог техники
              </h1>
              <p className="mt-3 max-w-xl text-base font-semibold leading-7 text-ink/68 md:text-[13px] md:leading-5 xl:text-[15px] xl:leading-6">
                Более 200 единиц техники в аренду с оператором и без по выгодным ценам.
              </p>
              <Button href="#catalog-lead" className="mt-6 h-[54px] w-fit rounded-[8px] px-8 text-sm font-black md:mt-4 md:h-8 md:px-5 md:text-[11px] xl:h-11 xl:px-7 xl:text-sm">
                Получить подбор
              </Button>
              <div className="mt-8 grid max-w-[760px] gap-4 sm:grid-cols-3 md:mt-5 md:gap-2 xl:mt-7 xl:gap-3">
                {[
                  [ShieldCheck, "Техника в отличном состоянии"],
                  [Clock3, "Подача за 2 часа"],
                  [BadgeCheck, "Страхование техподдержка"]
                ].map(([Icon, text]) => {
                  const TypedIcon = Icon as typeof ShieldCheck;
                  return (
                    <div key={text as string} className="flex items-center gap-3 text-xs font-bold leading-5 md:gap-2 md:text-[10px] md:leading-4 xl:gap-3 xl:text-xs xl:leading-5">
                      <TypedIcon className="text-accent md:size-4 xl:size-[22px]" size={22} />
                      {text as string}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-3 md:p-4">
              <EquipmentVisual type="excavator" variant="hero" className="h-full min-h-[250px] rounded-[12px] md:!min-h-0 xl:rounded-[14px]" />
            </div>
          </div>
          <div className="mt-3 hidden rounded-[14px] bg-white p-3 shadow-card md:grid md:grid-cols-[1fr_0.9fr_1.25fr_0.9fr_1fr_84px_70px] md:gap-3 xl:mt-4 xl:rounded-[18px] xl:p-5 xl:md:grid-cols-[1fr_1fr_1.25fr_1fr_1fr_120px_90px] xl:gap-4">
            {["Тип техники", "Вес, т", "Цена, BYN/смена", "Срок", "Навесное"].map((label) => (
              <label key={label} className="grid gap-1 text-[10px] font-bold text-ink/56 xl:gap-2 xl:text-xs">
                {label}
                <select className="h-8 rounded-[8px] border border-ink/10 bg-paper px-3 text-xs font-bold text-ink xl:h-11 xl:px-4 xl:text-sm">
                  <option>Любой</option>
                </select>
              </label>
            ))}
            <button className="self-end rounded-[8px] bg-night px-4 text-xs font-black text-white xl:px-5 xl:text-sm">Показать</button>
            <button className="self-end px-2 text-sm font-bold text-ink/52">Сбросить</button>
          </div>
          <div className="mt-3 hidden flex-wrap gap-2 md:flex xl:mt-4 xl:gap-3">
            {["Все", "Мини-экскаваторы", "Погрузчики", "Автовышки", "Самосвалы", "Катки", "Навесное", "Другая техника"].map((item, index) => (
              <span key={item} className={`rounded-full px-5 py-2.5 text-sm font-black md:px-3.5 md:py-1.5 md:text-[11px] xl:px-5 xl:py-2.5 xl:text-sm ${index === 0 ? "bg-accent" : "border border-ink/10 bg-white"}`}>
                {item}
              </span>
            ))}
          </div>
        </section>
        <CatalogPageClient initialCategory={initialCategory} />
      </main>
      <Footer />
      <StickyMobileCTA target="#catalog-lead" />
    </>
  );
}
