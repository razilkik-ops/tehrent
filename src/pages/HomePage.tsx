import { CalendarCheck, Clock3, PhoneCall, ShieldCheck, Truck, X } from "lucide-react";
import { useState } from "react";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { Button } from "@/components/Button";
import { EquipmentVisual } from "@/components/EquipmentVisual";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HowItWorks } from "@/components/HowItWorks";
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

const mobileFeaturedEquipment = equipment.slice(0, 4);

const cases = [
  "Строительство зданий и сооружений",
  "Благоустройство территорий",
  "Коммунальные работы",
  "Демонтаж и снос конструкций",
  "Промышленные объекты",
  "Складская и логистика"
];

function getFeaturedEquipmentCard(item: Equipment) {
  const hourlyPrice = item.hourlyPrice ?? Math.round(item.pricePerShift / 8);

  if (item.id === "eq-kubota-u27") {
    return {
      hourlyPrice,
      title: "Аренда мини-экскаватора с буром на базе KX41-3V",
      workLabel: "Глубина отверстий",
      workSpec: item.specs["Глубина отверстий"],
      attachmentsLabel: "Шнеки",
      attachmentsValue: "Шнеки 200, 250, 300, 400 мм"
    };
  }

  if (item.id === "eq-jcb-1cx") {
    return {
      hourlyPrice,
      title: "Аренда мини-погрузчика New Holland L160",
      workLabel: "Ширина ковша",
      workSpec: item.specs["Ширина ковша"],
      attachmentsLabel: "Навесное",
      attachmentsValue: "Ковш 0,35 м3, гидробур"
    };
  }

  if (item.id === "eq-bobcat-s650") {
    return {
      hourlyPrice,
      title: "Аренда мини-погрузчика с гидробуром на базе New Holland L160",
      workLabel: "Глубина отверстий",
      workSpec: item.specs["Глубина отверстий"],
      attachmentsLabel: "Диаметр шнека",
      attachmentsValue: "200, 300, 400 мм"
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
    attachmentsValue: item.id === "eq-bobcat-e35" ? "20, 30, 50 см, планировочные" : item.attachments[0]
  };
}

export function HomePage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

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
                  src="/images/equipment/hero-mini-equipment.png"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-[67%_50%]"
                  loading="eager"
                />
                <span className="absolute inset-0 bg-night/72" />
                <span className="absolute inset-0 bg-gradient-to-b from-night/62 via-night/42 to-night/80" />
                <div className="relative z-10">
                  <h1 className="max-w-[340px] text-[22px] font-black leading-[1.2]">
                    Аренда мини-техники для копки траншей, планировки участка и других строительных работ
                  </h1>
                  <p className="mt-5 max-w-[300px] text-base font-semibold leading-7 text-white/86">
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
                  onClick={() => setBookingModalOpen(true)}
                  className="flex min-h-[74px] items-center gap-4 rounded-[14px] border border-accent/70 bg-accent px-5 text-night shadow-card"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-[11px] border border-night/12 bg-white/24">
                    <CalendarCheck size={23} />
                  </span>
                  <span className="text-xl font-black uppercase leading-tight">Заказать</span>
                </button>
              </div>
            </div>

            <RentalCalculator className="mt-7" target="#mobile-lead" />

            <section id="mobile-equipment" className="mt-7">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-accent">Каталог аренды</p>
                  <h2 className="mt-1 text-[34px] font-black leading-tight text-ink">Техника в наличии</h2>
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
                          imageUrl={item.imageUrl}
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
                            <p className="mt-1 text-lg font-black text-ink">от {formatPrice(card.hourlyPrice)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-ink/48">Смена 8ч</p>
                            <p className="mt-1 text-lg font-black text-accent">от {formatPrice(item.pricePerShift)}</p>
                          </div>
                        </div>
                        <Button href="#mobile-lead" className="mt-4 h-12 w-full rounded-[10px] text-base font-black">
                          Забронировать
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-5">
                <QuickRequestForm id="mobile-lead" />
              </div>
            </section>
          </div>

          <div className="hidden md:block">
            <div className="relative isolate overflow-hidden rounded-[24px] bg-white shadow-soft lg:rounded-[28px]">
              <div className="grid min-h-[560px] lg:grid-cols-[1.02fr_0.98fr]">
                <div className="relative z-10 flex flex-col justify-center px-8 py-10 lg:px-12 xl:px-16">
                  <p className="text-sm font-black uppercase text-accent">Аренда мини-техники</p>
                  <h1 className="mt-4 max-w-[720px] text-[40px] font-black leading-[1.08] tracking-normal text-ink lg:text-[48px] xl:text-[54px]">
                    Аренда мини-техники для копки траншей, планировки участка и других строительных работ
                  </h1>
                  <p className="mt-6 max-w-[620px] text-xl font-semibold leading-8 text-ink/68">
                    Подберем мини-экскаватор, мини-погрузчик под любую задачу, доставим на объект в течение двух часов.
                  </p>

                  <div className="mt-8 grid max-w-[720px] grid-cols-3 gap-3">
                    {mobileHeroItems.map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="grid min-h-[112px] place-items-center gap-3 rounded-[14px] border border-ink/8 bg-paper px-4 py-5 text-center shadow-card"
                      >
                        <span className="grid size-11 place-items-center rounded-[12px] bg-accent/18 text-accent">
                          <Icon size={22} />
                        </span>
                        <span className="text-sm font-black leading-tight text-ink">{label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid max-w-[720px] grid-cols-[1fr_auto] gap-4">
                    <a
                      href="tel:+3752920958258"
                      className="flex min-h-[76px] items-center gap-4 rounded-[14px] border border-accent/55 bg-white px-5 text-night shadow-card"
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-[12px] border border-accent/45 bg-accent/12 text-accent">
                        <PhoneCall size={24} />
                      </span>
                      <span className="text-2xl font-black">+375 29 209-58-25</span>
                    </a>
                    <Button href="#desktop-lead" className="h-[76px] rounded-[14px] px-10 text-lg font-black uppercase">
                      Заказать
                    </Button>
                  </div>
                </div>

                <div className="relative min-h-[560px] overflow-hidden bg-night">
                  <img
                    src="/images/equipment/hero-mini-equipment.png"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-[66%_50%]"
                    loading="eager"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/12 to-transparent" />
                  <span className="absolute bottom-8 left-8 rounded-[14px] bg-night/68 px-5 py-4 text-sm font-black leading-5 text-white shadow-card backdrop-blur-md">
                    Мини-экскаваторы и мини-погрузчики в наличии сегодня
                  </span>
                </div>
              </div>
            </div>

            <RentalCalculator className="mt-10" target="#desktop-lead" />

            <section id="desktop-equipment" className="pt-10">
              <div className="flex items-end justify-between gap-8">
                <div>
                  <p className="text-sm font-black uppercase text-accent">Каталог аренды</p>
                  <h2 className="mt-2 text-[44px] font-black leading-tight text-ink">Техника в наличии</h2>
                </div>
                <p className="max-w-[460px] text-right text-base font-semibold leading-7 text-ink/58">
                  Мини-экскаваторы и мини-погрузчики для траншей, бурения, планировки, засыпки и погрузочных работ.
                </p>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {mobileFeaturedEquipment.map((item) => {
                  const card = getFeaturedEquipmentCard(item);

                  return (
                    <article key={item.id} className="flex overflow-hidden rounded-[14px] bg-white shadow-card">
                      <a href={`/equipment/${item.slug}`} aria-label={item.title} className="block shrink-0">
                        <EquipmentVisual
                          type={item.imagePlaceholderType}
                          imageUrl={item.imageUrl}
                          priorityLabel="В наличии"
                          className="h-full min-h-[300px] w-[300px] !min-w-[300px] rounded-none"
                        />
                      </a>
                      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                        <p className="text-[11px] font-black uppercase text-ink/44">{item.category}</p>
                        <h3 className="mt-2 text-[22px] font-black uppercase leading-tight text-ink">
                          {card.title}
                        </h3>
                        <p className="mt-3 text-sm font-semibold leading-6 text-ink/62">
                          {item.shortDescription}
                        </p>
                        <dl className="mt-5 grid grid-cols-3 overflow-hidden rounded-[10px] border border-ink/8 bg-paper/70 text-center">
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
                        <div className="mt-auto grid grid-cols-2 gap-3 border-y border-ink/8 py-4">
                          <div>
                            <p className="text-xs font-bold text-ink/48">1 час</p>
                            <p className="mt-1 text-lg font-black text-ink">от {formatPrice(card.hourlyPrice)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-ink/48">Смена 8ч</p>
                            <p className="mt-1 text-lg font-black text-accent">от {formatPrice(item.pricePerShift)}</p>
                          </div>
                        </div>
                        <Button href="#desktop-lead" className="mt-4 h-12 w-full rounded-[10px] text-base font-black">
                          Забронировать
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div id="desktop-lead" className="mt-8">
                <QuickRequestForm />
              </div>
            </section>
          </div>
        </section>

        <BenefitsGrid />
        <HowItWorks />

        <section id="services" className="w-full content-gutter py-12">
          <div className="mx-auto max-w-none">
          <SectionTitle title="Решаем задачи на любых объектах" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {cases.map((item, index) => (
              <div key={item} className="relative overflow-hidden rounded-[12px] bg-night text-white shadow-card">
                <EquipmentVisual
                  type={index % 3 === 0 ? "excavator" : index % 3 === 1 ? "loader" : "truck"}
                  variant="dark"
                  className="h-[245px] min-h-0 rounded-none opacity-95"
                />
                <h3 className="absolute inset-x-4 bottom-5 text-center text-[22px] font-black leading-tight">{item}</h3>
              </div>
            ))}
          </div>
          </div>
        </section>

        <FinalCTA />
      </main>
      {bookingModalOpen ? (
        <div
          className="fixed inset-0 z-[70] grid items-end bg-night/62 px-3 pb-3 pt-16 backdrop-blur-sm md:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          onClick={() => setBookingModalOpen(false)}
        >
          <div
            className="max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-[18px] border border-accent/28 bg-white p-3 shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-4 px-1 pt-1">
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-accent text-night">
                  <CalendarCheck size={22} />
                </span>
                <div>
                  <h2 id="booking-modal-title" className="text-xl font-black leading-tight text-ink">
                    Быстрый заказ
                  </h2>
                  <p className="mt-1 text-xs font-semibold leading-5 text-ink/58">
                    Оставьте телефон, и мы подберём технику под задачу.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="focus-ring grid size-10 shrink-0 place-items-center rounded-[10px] border border-ink/10 bg-paper text-ink"
                aria-label="Закрыть форму"
                onClick={() => setBookingModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <QuickRequestForm id="booking-modal-lead" sourcePage="home-modal" />
          </div>
        </div>
      ) : null}
      <Footer />
      {!bookingModalOpen ? <StickyMobileCTA target="#mobile-lead" /> : null}
    </>
  );
}
