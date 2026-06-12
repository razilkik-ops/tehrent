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
import { equipment, formatPrice, type Equipment } from "@/lib/equipment";
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
const mobileFeaturedEquipment = featuredEquipmentIds
  .map((id) => equipment.find((item) => item.id === id))
  .filter((item): item is Equipment => Boolean(item));

const cases = [
  {
    title: "Бурение свай под фундамент",
    imageUrl: "/images/services/foundation-pile-drilling.jpg"
  },
  {
    title: "Благоустройство территорий",
    imageUrl: "/images/services/landscaping.webp"
  },
  {
    title: "Доставка грунта",
    imageUrl: "/images/services/soil-delivery.jpg"
  },
  {
    title: "Укладка плитки",
    imageUrl: "/images/services/paving-installation.jpg"
  },
  {
    title: "Монтаж канализации",
    imageUrl: "/images/services/sewer-installation.jpg"
  },
  {
    title: "Дренаж участка",
    imageUrl: "/images/services/site-drainage.jpg"
  }
];

function getFeaturedEquipmentCard(item: Equipment) {
  const hourlyPrice = item.hourlyPrice ?? Math.round(item.pricePerShift / 8);

  if (item.id === "eq-kubota-u27") {
    return {
      hourlyPrice,
      title: "Аренда мини-экскаватора с буром KX41-3V",
      workLabel: "Глубина отверстий",
      workSpec: item.specs["Глубина отверстий"],
      attachmentsLabel: "Шнеки",
      attachmentsValue: "Шнеки 200, 250, 300, 400 мм",
      hourlyPriceLabel: `от ${formatPrice(hourlyPrice)}`,
      shiftPriceLabel: `от ${formatPrice(item.pricePerShift)}`
    };
  }

  if (item.id === "eq-jcb-1cx") {
    return {
      hourlyPrice,
      title: "Аренда мини-погрузчика New Holland L160",
      workLabel: "Ширина ковша",
      workSpec: item.specs["Ширина ковша"],
      attachmentsLabel: "Навесное",
      attachmentsValue: "Ковш 0,35 м3, гидробур",
      hourlyPriceLabel: `от ${formatPrice(hourlyPrice)}`,
      shiftPriceLabel: `от ${formatPrice(item.pricePerShift)}`
    };
  }

  if (item.id === "eq-bobcat-e32") {
    return {
      hourlyPrice,
      title: "Аренда мини-экскаватора BOBCAT E32",
      workLabel: "Глубина копания",
      workSpec: item.specs["Глубина копания"],
      attachmentsLabel: "Навесное",
      attachmentsValue: "Ковши 30, 50, 60, 120 см, гидромолот",
      hourlyPriceLabel: `от ${formatPrice(hourlyPrice)}`,
      shiftPriceLabel: `от ${formatPrice(item.pricePerShift)}`
    };
  }

  if (item.id === "eq-bobcat-s650") {
    return {
      hourlyPrice,
      title: "Аренда мини-погрузчика с гидробуром New Holland L160",
      workLabel: "Глубина отверстий",
      workSpec: item.specs["Глубина отверстий"],
      attachmentsLabel: "Диаметр шнека",
      attachmentsValue: "200, 300, 400 мм",
      hourlyPriceLabel: `от ${formatPrice(hourlyPrice)}`,
      shiftPriceLabel: `от ${formatPrice(item.pricePerShift)}`
    };
  }

  if (item.id === "eq-kamaz-6520") {
    return {
      hourlyPrice,
      title: "Аренда самосвала 10-20 т",
      workLabel: "Работы",
      workSpec: "вывоз и доставка",
      attachmentsLabel: "Цена",
      attachmentsValue: "договорная",
      hourlyPriceLabel: "Цена договорная",
      shiftPriceLabel: "Цена договорная"
    };
  }

  if (item.id === "eq-volvo-bl71") {
    return {
      hourlyPrice,
      title: "Аренда экскаватора-погрузчика Volvo BL71",
      workLabel: "Глубина копания",
      workSpec: item.specs["Глубина копания"],
      attachmentsLabel: "Цена",
      attachmentsValue: "130 руб/час",
      hourlyPriceLabel: `от ${formatPrice(hourlyPrice)}`,
      shiftPriceLabel: `от ${formatPrice(item.pricePerShift)}`
    };
  }

  if (item.id === "eq-amkodor-loader") {
    return {
      hourlyPrice,
      title: "Аренда фронтального погрузчика Амкодор",
      workLabel: "Объем ковша",
      workSpec: item.specs["Объем ковша"],
      attachmentsLabel: "Цена",
      attachmentsValue: "130 руб/час",
      hourlyPriceLabel: `от ${formatPrice(hourlyPrice)}`,
      shiftPriceLabel: `от ${formatPrice(item.pricePerShift)}`
    };
  }

  return {
    hourlyPrice,
    title: `Аренда ${item.title}`,
    workLabel: item.specs["Глубина копания"] ? "Глубина копания" : item.specs["Глубина отверстий"] ? "Глубина" : "Работа",
    workSpec:
      item.specs["Глубина копания"] ||
      item.specs["Глубина отверстий"] ||
      item.specs["Высота выгрузки"] ||
      item.specs["Работа"] ||
      item.specs["Ширина"],
    attachmentsLabel: item.id === "eq-bobcat-e35" ? "Ковши" : "Навесное",
    attachmentsValue: item.id === "eq-bobcat-e35" ? "20, 30, 50 см, планировочные" : item.attachments[0],
    hourlyPriceLabel: `от ${formatPrice(hourlyPrice)}`,
    shiftPriceLabel: `от ${formatPrice(item.pricePerShift)}`
  };
}

export function HomePage() {
  const { openOrderModal } = useOrderModal();

  usePageMeta(
    "Аренда спецтехники с доставкой | Arentex.by",
    "Аренда мини-экскаваторов, мини-погрузчиков, автовышек, самосвалов и навесного оборудования с оператором."
  );

  return (
    <>
      <Header />
      <main>
        <section className="w-full content-gutter pt-0">
          <div className="md:hidden">
            <div className="rounded-[18px]">
              <div className="relative isolate min-h-[360px] overflow-hidden rounded-[18px] bg-night px-5 py-6 text-white shadow-soft">
                <img
                  src="/images/equipment/hero-mini-equipment-mobile.webp"
                  alt=""
                  className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-45 blur-sm"
                  loading="eager"
                />
                <img
                  src="/images/equipment/hero-mini-equipment-mobile.webp"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  loading="eager"
                />
                <span className="absolute inset-0 bg-night/72" />
                <span className="absolute inset-0 bg-gradient-to-b from-night/62 via-night/42 to-night/80" />
                <span className="absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-night/96 via-night/82 to-night/8" />
                <div className="relative z-10">
                  <h1 className="max-w-[340px] text-[22px] font-black leading-[1.2] drop-shadow-[0_3px_12px_rgba(0,0,0,0.86)]">
                    Аренда мини-техники для копки траншей, планировки участка и других строительных работ
                  </h1>
                  <p className="mt-5 max-w-[300px] text-base font-semibold leading-7 text-white/92 drop-shadow-[0_2px_10px_rgba(0,0,0,0.82)]">
                    Подберем мини-экскаватор, мини-погрузчик под любую задачу, доставим на объект в течение двух часов.
                  </p>
                  <div className="mt-8 grid grid-cols-3 gap-2">
                    {mobileHeroItems.map(({ icon: Icon, label }) => (
                      <span
                        key={label}
                        className="grid min-h-[76px] place-items-center gap-1.5 rounded-[12px] bg-night/58 px-1.5 py-2 text-center text-[10px] font-black leading-tight text-white/94 backdrop-blur-sm"
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
                  href="tel:+3752920958258"
                  className="flex min-h-[74px] items-center gap-4 rounded-[14px] border border-accent/55 bg-white px-5 text-night shadow-card"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-[11px] border border-accent/45 bg-accent/12 text-accent">
                    <PhoneCall size={23} />
                  </span>
                  <span className="text-xl font-black">+375 29 209-58-25</span>
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
                      <a href={`/equipment/${item.slug}`} aria-label={item.title}>
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
                        <dl className="mt-4 grid grid-cols-3 overflow-hidden rounded-[10px] border border-ink/8 bg-paper/70 text-center">
                          {[
                            {
                              label: "Масса",
                              value: item.specs["Эксплуатационная масса"] || item.specs["Масса"] || item.specs["Грузоподъемность"]
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
                            <div key={spec.label} className="border-r border-ink/8 px-2 py-3 last:border-r-0">
                              <dt className="text-[9px] font-black uppercase leading-tight text-ink/42">{spec.label}</dt>
                              <dd className="mt-1.5 break-words text-xs font-black leading-tight text-ink">{spec.value}</dd>
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
                  src="/images/equipment/hero-mini-equipment.png"
                  alt=""
                  className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-42 blur-sm"
                  loading="eager"
                />
                <img
                  src="/images/equipment/hero-mini-equipment.png"
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
                    Аренда мини-техники для копки траншей, планировки участка и других строительных работ
                    </h1>
                    <p className="mt-6 max-w-[620px] text-xl font-semibold leading-8 text-white/92 drop-shadow-[0_3px_14px_rgba(0,0,0,0.78)] xl:text-[22px] xl:leading-9">
                    Подберем мини-экскаватор, мини-погрузчик под любую задачу, доставим на объект в течение двух часов.
                    </p>
                  </div>

                  <div className="max-w-[780px]">
                    <div className="grid grid-cols-3 gap-4">
                      {mobileHeroItems.map(({ icon: Icon, label }) => (
                        <div
                          key={label}
                          className="grid min-h-[118px] place-items-center gap-3 rounded-[16px] bg-night/54 px-4 py-5 text-center text-white shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:min-h-[126px] xl:min-h-[136px]"
                        >
                          <span className="grid size-11 place-items-center rounded-[12px] bg-accent/14 text-accent lg:size-12 xl:size-14">
                            <Icon className="size-6 lg:size-7 xl:size-8" strokeWidth={2.2} />
                          </span>
                          <span className="text-sm font-black leading-tight text-white/94">{label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <a
                        href="tel:+3752920958258"
                        className="flex h-[76px] min-w-0 items-center gap-4 rounded-[14px] border border-accent/55 bg-white px-5 text-night shadow-[0_18px_45px_rgba(0,0,0,0.22)]"
                      >
                        <span className="grid size-12 shrink-0 place-items-center rounded-[12px] border border-accent/45 bg-accent/12 text-accent">
                          <PhoneCall size={24} />
                        </span>
                        <span className="truncate text-2xl font-black">+375 29 209-58-25</span>
                      </a>
                      <Button
                        type="button"
                        className="h-[76px] w-full rounded-[14px] px-5 text-lg font-black uppercase"
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
                      <a href={`/equipment/${item.slug}`} aria-label={item.title} className="block">
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
                        <dl className="mt-4 grid grid-cols-3 overflow-hidden rounded-[9px] border border-ink/8 bg-paper/70 text-center">
                          {[
                            {
                              label: "Масса",
                              value: item.specs["Эксплуатационная масса"] || item.specs["Масса"] || item.specs["Грузоподъемность"]
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
                            <div key={spec.label} className="border-r border-ink/8 px-1.5 py-2.5 last:border-r-0">
                              <dt className="text-[8px] font-black uppercase leading-tight text-ink/42">{spec.label}</dt>
                              <dd className="mt-1 break-words text-[10px] font-black leading-tight text-ink xl:text-[11px]">{spec.value}</dd>
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
