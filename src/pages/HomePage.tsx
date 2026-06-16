import { CalendarCheck, Clock3, PhoneCall, ShieldCheck, Truck } from "lucide-react";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { Button } from "@/components/Button";
import { EquipmentVisual } from "@/components/EquipmentVisual";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HowItWorks } from "@/components/HowItWorks";
import { useOrderModal } from "@/components/OrderModal";
import { QuickRequestForm } from "@/components/QuickRequestForm";
import { RentalCalculator } from "@/components/RentalCalculator";
import { SectionTitle } from "@/components/SectionTitle";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { useEquipmentCatalog } from "@/lib/equipment-catalog";
import { formatPrice, type Equipment } from "@/lib/equipment";
import { getHomeMeta } from "@/lib/seo.js";
import { buildAppPath } from "@/lib/site-paths";
import { usePageMeta } from "@/src/usePageMeta";

const mobileHeroItems = [
  { icon: Truck, label: "Собственная доставка" },
  { icon: Clock3, label: "Минимальный заказ от 3 часов" },
  { icon: ShieldCheck, label: "Опытнейшие операторы" }
];

const featuredEquipmentIds = [
  "eq-bobcat-e35",
  "eq-kubota-u27",
  "eq-jcb-1cx",
  "eq-bobcat-s650",
  "eq-volvo-bl71",
  "eq-kamaz-6520",
  "eq-amkodor-loader",
  "eq-bobcat-e32"
];

const cases = [
  {
    title: "Бурение свай под фундамент",
    imageUrl: buildAppPath("/images/services/foundation-pile-drilling.jpg")
  },
  {
    title: "Благоустройство территорий",
    imageUrl: buildAppPath("/images/services/landscaping.webp")
  },
  {
    title: "Доставка грунта",
    imageUrl: buildAppPath("/images/services/soil-delivery.jpg")
  },
  {
    title: "Укладка плитки",
    imageUrl: buildAppPath("/images/services/paving-installation.jpg")
  },
  {
    title: "Монтаж канализации",
    imageUrl: buildAppPath("/images/services/sewer-installation.jpg")
  },
  {
    title: "Дренаж участка",
    imageUrl: buildAppPath("/images/services/site-drainage.jpg")
  }
];

function getFeaturedEquipmentCard(item: Equipment) {
  const massSpec = item.specs["Эксплуатационная масса"] || item.specs["Масса"] || item.specs["Грузоподъемность"];
  const workEntry =
    Object.entries(item.specs).find(([key]) => !["Эксплуатационная масса", "Масса", "Грузоподъемность"].includes(key)) ||
    Object.entries(item.specs)[0];
  const workLabel = workEntry?.[0] || "Параметр";
  const workSpec = workEntry?.[1] || "—";
  const attachmentsValue = item.attachments.slice(0, 2).join(", ") || "Уточняйте";
  const hourlyPriceLabel = item.hourlyPrice ? `от ${formatPrice(item.hourlyPrice)}` : item.priceLabel || "По запросу";
  const shiftPriceLabel = item.priceLabel || `от ${formatPrice(item.pricePerShift)}`;

  return {
    title: item.title,
    massSpec,
    workLabel,
    workSpec,
    attachmentsLabel: "Навесное",
    attachmentsValue,
    hourlyPriceLabel,
    shiftPriceLabel
  };
}

export function HomePage() {
  const { openOrderModal } = useOrderModal();
  const { equipment } = useEquipmentCatalog();
  const mobileFeaturedEquipment = [
    ...featuredEquipmentIds
      .map((id) => equipment.find((item) => item.id === id))
      .filter((item): item is Equipment => Boolean(item)),
    ...equipment.filter((item) => !featuredEquipmentIds.includes(item.id))
  ];

  usePageMeta(getHomeMeta(equipment));

  return (
    <>
      <Header />
      <main>
        <section className="w-full content-gutter pt-0">
          <div className="md:hidden">
            <div className="rounded-[18px]">
              <div className="relative isolate min-h-[400px] overflow-hidden rounded-[18px] bg-night px-5 pb-5 pt-6 text-white shadow-soft">
                <img
                  src={buildAppPath("/images/equipment/hero-mini-equipment-desktop.jpg")}
                  alt=""
                  className="absolute inset-0 h-full w-full scale-110 object-cover object-[58%_center] opacity-45 blur-sm"
                  loading="eager"
                />
                <img
                  src={buildAppPath("/images/equipment/hero-mini-equipment-desktop.jpg")}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-[58%_center]"
                  loading="eager"
                />
                <span className="absolute inset-0 bg-night/72" />
                <span className="absolute inset-0 bg-gradient-to-b from-night/62 via-night/42 to-night/80" />
                <span className="absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-night/96 via-night/82 to-night/8" />
                <div className="relative z-10 flex min-h-[350px] flex-col">
                  <h1 className="max-w-[340px] text-[22px] font-black leading-[1.2] drop-shadow-[0_3px_12px_rgba(0,0,0,0.86)]">
                    Мини-экскаваторы, погрузчики и другая спецтехника в аренду с доставкой
                  </h1>
                  <div className="mt-auto grid grid-cols-3 gap-2 pt-8">
                    {mobileHeroItems.map(({ icon: Icon, label }) => (
                      <span
                        key={label}
                        className="grid min-h-[84px] place-items-center gap-1.5 rounded-[12px] bg-night/58 px-2 py-3 text-center text-[10px] font-black leading-tight text-white/94 backdrop-blur-sm"
                      >
                        <Icon size={18} className="text-accent" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid gap-3">
                <a
                  href="tel:+375299209582"
                  className="flex min-h-[74px] items-center gap-4 rounded-[14px] border border-accent/55 bg-white px-5 text-night shadow-card"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-[11px] border border-accent/45 bg-accent/12 text-accent">
                    <PhoneCall size={23} />
                  </span>
                  <span className="text-xl font-black">+375 29 920-95-82</span>
                </a>

                <button
                  type="button"
                  onClick={() =>
                    openOrderModal({
                      sourcePage: "home-mobile-hero",
                      formType: "hero-order",
                      hiddenTask: "Заявка из главного экрана"
                    })
                  }
                  className="flex min-h-[74px] items-center gap-4 rounded-[14px] border border-accent/70 bg-accent px-5 text-night shadow-card"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-[11px] border border-night/12 bg-white/24">
                    <CalendarCheck size={23} />
                  </span>
                  <span className="text-xl font-black uppercase leading-tight">Заказать</span>
                </button>
              </div>
            </div>

            <section id="mobile-equipment" className="mt-7">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-accent">Каталог аренды</p>
                  <h2 className="mt-1 text-[34px] font-black leading-tight text-ink">Техника в наличии для заказа</h2>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                {mobileFeaturedEquipment.map((item) => {
                  const card = getFeaturedEquipmentCard(item);

                  return (
                    <article key={item.id} className="overflow-hidden rounded-[12px] bg-white shadow-card">
                      <a href={buildAppPath(`/equipment/${item.slug}`)} aria-label={item.title}>
                        <EquipmentVisual
                          type={item.imagePlaceholderType}
                          imageUrl={item.mobileImageUrl || item.imageUrl}
                          imageFit="cover"
                          priorityLabel="В наличии"
                          className="h-[220px] !min-h-0 rounded-none"
                        />
                      </a>
                      <div className="px-5 pb-5 pt-4">
                        <p className="text-[11px] font-black uppercase text-ink/44">{item.category}</p>
                        <h3 className="mt-2 text-[22px] font-black uppercase leading-tight text-ink">
                          {card.title}
                        </h3>
                        <p className="mt-3 text-sm font-semibold leading-6 text-ink/62">{item.shortDescription}</p>
                        <dl className="mt-4 grid h-[92px] grid-cols-3 overflow-hidden rounded-[10px] border border-ink/8 bg-paper/70 text-center">
                          {[
                            {
                              label: "Масса",
                              value: card.massSpec
                            },
                            {
                              label: card.workLabel,
                              value: card.workSpec
                            },
                            {
                              label: card.attachmentsLabel,
                              value: card.attachmentsValue
                            }
                          ].map((spec) => (
                            <div key={spec.label} className="flex min-w-0 flex-col items-center justify-center border-r border-ink/8 px-2 py-2 last:border-r-0">
                              <dt className="text-[9px] font-black uppercase leading-tight text-ink/42">{spec.label}</dt>
                              <dd className="mt-1.5 max-w-full break-words text-xs font-black leading-tight text-ink">{spec.value}</dd>
                            </div>
                          ))}
                        </dl>
                        <div className="mt-5 grid grid-cols-2 gap-3 border-y border-ink/8 py-4">
                          <div>
                            <p className="text-xs font-bold text-ink/48">1 час</p>
                            <p className="mt-1 text-lg font-black text-ink">{card.hourlyPriceLabel}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-ink/48">Смена 8ч</p>
                            <p className="mt-1 text-lg font-black text-accent">{card.shiftPriceLabel}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-xs font-semibold leading-5 text-ink/48">
                          Ориентировочный расчет. Точная сумма по телефону.
                        </p>
                        <Button
                          type="button"
                          className="mt-4 h-12 w-full rounded-[10px] text-base font-black"
                          onClick={() =>
                            openOrderModal({
                              sourcePage: "home-mobile-catalog",
                              equipmentId: item.id,
                              selectedEquipment: [item.id],
                              formType: "catalog-order",
                              hiddenTask: `Заказать ${item.title}`
                            })
                          }
                        >
                          Заказать
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <RentalCalculator className="mt-5" sourcePage="home-mobile-calculator" />

              <div className="mt-5">
                <QuickRequestForm id="mobile-lead" />
              </div>
            </section>
          </div>

          <div className="hidden md:block">
            <div className="rounded-[28px]">
              <div className="relative isolate min-h-[700px] overflow-hidden rounded-[28px] bg-night px-8 py-9 text-white shadow-soft lg:min-h-[730px] lg:px-12 lg:py-11 xl:min-h-[760px] xl:px-16">
                <img
                  src={buildAppPath("/images/equipment/hero-mini-equipment-desktop.jpg")}
                  alt=""
                  className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-42 blur-sm"
                  loading="eager"
                />
                <img
                  src={buildAppPath("/images/equipment/hero-mini-equipment-desktop.jpg")}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  loading="eager"
                />
                <span className="absolute inset-0 bg-night/48" />
                <span className="absolute inset-0 bg-gradient-to-r from-night/94 via-night/58 to-night/8" />
                <span className="absolute inset-0 bg-gradient-to-b from-night/82 via-night/18 to-night/86" />
                <span className="absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-night/92 via-night/58 to-transparent" />

                <div className="relative z-10 flex min-h-[628px] flex-col justify-between lg:min-h-[640px] xl:min-h-[668px]">
                  <div className="max-w-[780px] pt-2 lg:pt-6">
                    <p className="text-sm font-black uppercase text-accent drop-shadow-[0_3px_12px_rgba(0,0,0,0.7)]">
                      Аренда мини-техники
                    </p>
                    <h1 className="mt-5 max-w-[760px] text-[42px] font-black leading-[1.08] tracking-normal text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.82)] lg:text-[52px] xl:text-[60px]">
                    Мини-экскаваторы, погрузчики и другая спецтехника в аренду с доставкой
                    </h1>
                    <p className="mt-6 max-w-[620px] text-xl font-semibold leading-8 text-white/92 drop-shadow-[0_3px_14px_rgba(0,0,0,0.78)] xl:text-[22px] xl:leading-9">
                    Подберем мини-экскаватор, мини-погрузчик под любую задачу, доставим на объект в течение двух часов.
                    </p>
                  </div>

                  <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between xl:gap-8">
                    <div className="grid w-full max-w-[720px] grid-cols-2 gap-4 xl:max-w-[640px]">
                      <a
                        href="tel:+375299209582"
                        className="flex h-[76px] min-w-0 items-center gap-4 rounded-[14px] border border-accent/55 bg-white px-5 text-night shadow-[0_18px_45px_rgba(0,0,0,0.22)]"
                      >
                        <span className="grid size-12 shrink-0 place-items-center rounded-[12px] border border-accent/45 bg-accent/12 text-accent">
                          <PhoneCall size={24} />
                        </span>
                        <span className="whitespace-nowrap text-[16px] font-black leading-none lg:text-[18px] xl:text-[20px] 2xl:text-[22px]">
                          +375 29 920-95-82
                        </span>
                      </a>
                      <Button
                        type="button"
                        className="h-[76px] w-full rounded-[14px] px-5 text-[16px] font-black uppercase whitespace-nowrap lg:text-[17px] xl:text-lg"
                        onClick={() =>
                          openOrderModal({
                            sourcePage: "home-desktop-hero",
                            formType: "hero-order",
                            hiddenTask: "Заявка из главного экрана"
                          })
                        }
                      >
                        Заказать
                      </Button>
                    </div>

                    <div className="grid w-full max-w-[560px] grid-cols-3 gap-3 self-end xl:max-w-[560px]">
                      {mobileHeroItems.map(({ icon: Icon, label }) => (
                        <div
                          key={label}
                          className="grid min-h-[82px] place-items-center gap-2 rounded-[14px] bg-night/54 px-3 py-3 text-center text-white shadow-[0_14px_34px_rgba(0,0,0,0.26)] backdrop-blur-xl xl:min-h-[90px]"
                        >
                          <span className="grid size-8 place-items-center rounded-[10px] bg-accent/14 text-accent xl:size-9">
                            <Icon className="size-5 xl:size-6" strokeWidth={2.2} />
                          </span>
                          <span className="text-[11px] font-black leading-tight text-white/94 xl:text-xs">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section id="desktop-equipment" className="pt-10">
              <div className="flex items-end justify-between gap-8">
                <div>
                  <p className="text-sm font-black uppercase text-accent">Каталог аренды</p>
                  <h2 className="mt-2 text-[44px] font-black leading-tight text-ink">Техника в наличии для заказа</h2>
                </div>
                <p className="max-w-[460px] text-right text-base font-semibold leading-7 text-ink/58">
                  Мини-экскаваторы, мини-погрузчики и самосвалы для земляных, строительных и погрузочных работ.
                </p>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-4">
                {mobileFeaturedEquipment.map((item) => {
                  const card = getFeaturedEquipmentCard(item);

                  return (
                    <article key={item.id} className="flex flex-col overflow-hidden rounded-[12px] bg-white shadow-card">
                      <a href={buildAppPath(`/equipment/${item.slug}`)} aria-label={item.title} className="block">
                        <EquipmentVisual
                          type={item.imagePlaceholderType}
                          imageUrl={item.imageUrl}
                          imageFit="cover"
                          imageBackdrop="none"
                          priorityLabel="В наличии"
                          className="aspect-[1200/751] !min-h-0 w-full rounded-none"
                        />
                      </a>
                      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
                        <p className="text-[10px] font-black uppercase text-ink/44">{item.category}</p>
                        <h3 className="mt-2 text-[17px] font-black uppercase leading-tight text-ink xl:text-[18px]">
                          {card.title}
                        </h3>
                        <p className="mt-2 text-xs font-semibold leading-5 text-ink/62">
                          {item.shortDescription}
                        </p>
                        <dl className="mt-4 grid h-[74px] grid-cols-3 overflow-hidden rounded-[9px] border border-ink/8 bg-paper/70 text-center">
                          {[
                            {
                              label: "Масса",
                              value: card.massSpec
                            },
                            {
                              label: card.workLabel,
                              value: card.workSpec
                            },
                            {
                              label: card.attachmentsLabel,
                              value: card.attachmentsValue
                            }
                          ].map((spec) => (
                            <div key={spec.label} className="flex min-w-0 flex-col items-center justify-center border-r border-ink/8 px-1.5 py-2 last:border-r-0">
                              <dt className="text-[8px] font-black uppercase leading-tight text-ink/42">{spec.label}</dt>
                              <dd className="mt-1 max-w-full break-words text-[10px] font-black leading-tight text-ink xl:text-[11px]">{spec.value}</dd>
                            </div>
                          ))}
                        </dl>
                        <div className="mt-auto grid grid-cols-2 gap-2 border-y border-ink/8 py-3">
                          <div>
                            <p className="text-[11px] font-bold text-ink/48">1 час</p>
                            <p className="mt-1 text-base font-black text-ink">{card.hourlyPriceLabel}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-ink/48">Смена 8ч</p>
                            <p className="mt-1 text-base font-black text-accent">{card.shiftPriceLabel}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-[11px] font-semibold leading-4 text-ink/48">
                          Ориентировочный расчет. Точная сумма по телефону.
                        </p>
                        <Button
                          type="button"
                          className="mt-3 h-11 w-full rounded-[9px] text-sm font-black"
                          onClick={() =>
                            openOrderModal({
                              sourcePage: "home-desktop-catalog",
                              equipmentId: item.id,
                              selectedEquipment: [item.id],
                              formType: "catalog-order",
                              hiddenTask: `Заказать ${item.title}`
                            })
                          }
                        >
                          Заказать
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <RentalCalculator className="mt-8 scroll-mt-24" id="desktop-lead" sourcePage="home-desktop-calculator" />
            </section>
          </div>
        </section>

        <BenefitsGrid />
        <HowItWorks />

        <section id="services" className="w-full content-gutter py-12">
          <div className="mx-auto max-w-none">
          <SectionTitle title="Решаем задачи на любых объектах" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {cases.map((item) => (
              <div key={item.title} className="relative isolate overflow-hidden rounded-[12px] bg-night text-white shadow-card">
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-[245px] w-full object-cover"
                  loading="lazy"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-night/88 via-night/34 to-night/6" />
                <h3 className="absolute inset-x-4 bottom-5 text-center text-[22px] font-black leading-tight drop-shadow-[0_3px_12px_rgba(0,0,0,0.72)]">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileCTA sourcePage="home-sticky-mobile" />
    </>
  );
}
