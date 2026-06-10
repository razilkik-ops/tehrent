import { BadgeCheck, CalendarCheck, Clock3, PhoneCall, ShieldCheck, Truck, X } from "lucide-react";
import { useState } from "react";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { Button } from "@/components/Button";
import { EquipmentVisual } from "@/components/EquipmentVisual";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HowItWorks } from "@/components/HowItWorks";
import { QuickRequestForm } from "@/components/QuickRequestForm";
import { SectionTitle } from "@/components/SectionTitle";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { equipment, formatPrice } from "@/lib/equipment";
import { usePageMeta } from "@/src/usePageMeta";

const stats = [
  { icon: Truck, value: "Своя", label: "доставка" },
  { icon: Clock3, value: "2 часа", label: "подача техники" },
  { icon: ShieldCheck, value: "8:00–22:00", label: "без выходных" }
];

const heroTrustItems = ["Собственный парк", "Исправная техника", "ТО по регламенту", "Быстрый выезд на объект"];

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
                  <span className="text-xl font-black uppercase leading-tight">Заявка</span>
                </button>
              </div>
            </div>

            <section id="mobile-equipment" className="mt-7">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-accent">Каталог аренды</p>
                  <h2 className="mt-1 text-[34px] font-black leading-tight text-ink">Техника в наличии</h2>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                {mobileFeaturedEquipment.map((item) => {
                  const hourlyPrice = item.hourlyPrice ?? Math.round(item.pricePerShift / 8);
                  const cardTitle =
                    item.id === "eq-kubota-u27"
                      ? "Аренда мини-экскаватора с буром на базе KX41-3V"
                      : item.id === "eq-jcb-1cx"
                        ? "Аренда мини-погрузчика New Holland L160"
                        : item.id === "eq-bobcat-s650"
                          ? "Аренда мини-погрузчика с гидробуром на базе New Holland L160"
                        : `Аренда ${item.title}`;
                  const workSpec =
                    item.id === "eq-kubota-u27"
                      ? item.specs["Глубина отверстий"]
                      : item.id === "eq-jcb-1cx"
                        ? item.specs["Ширина ковша"]
                        : item.id === "eq-bobcat-s650"
                          ? item.specs["Глубина отверстий"]
                        : item.specs["Глубина копания"] ||
                    item.specs["Глубина отверстий"] ||
                    item.specs["Высота выгрузки"] ||
                    item.specs["Работа"] ||
                    item.specs["Ширина"];
                  const workLabel =
                    item.id === "eq-kubota-u27"
                      ? "Глубина отверстий"
                      : item.specs["Глубина копания"]
                        ? "Глубина копания"
                        : item.id === "eq-jcb-1cx"
                          ? "Ширина ковша"
                          : item.id === "eq-bobcat-s650"
                            ? "Глубина отверстий"
                          : item.specs["Глубина отверстий"]
                            ? "Глубина"
                            : "Работа";
                  const attachmentsLabel =
                    item.id === "eq-bobcat-e35"
                      ? "Ковши"
                      : item.id === "eq-kubota-u27"
                        ? "Шнеки"
                        : item.id === "eq-bobcat-s650"
                          ? "Диаметр шнека"
                          : "Навесное";
                  const attachmentsValue =
                    item.id === "eq-bobcat-e35"
                      ? "20, 30, 50 см, планировочные"
                      : item.id === "eq-kubota-u27"
                        ? "Шнеки 200, 250, 300, 400 мм"
                        : item.id === "eq-jcb-1cx"
                          ? "Ковш 0,35 м3, гидробур"
                          : item.id === "eq-bobcat-s650"
                            ? "200, 300, 400 мм"
                          : item.attachments[0];

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
                          {cardTitle}
                        </h3>
                        <p className="mt-3 text-sm font-semibold leading-6 text-ink/62">{item.shortDescription}</p>
                        <dl className="mt-4 grid grid-cols-3 overflow-hidden rounded-[10px] border border-ink/8 bg-paper/70 text-center">
                          {[
                            {
                              label: "Масса",
                              value: item.specs["Эксплуатационная масса"] || item.specs["Масса"] || item.specs["Грузоподъемность"]
                            },
                            {
                              label: workLabel,
                              value: workSpec
                            },
                            {
                              label: attachmentsLabel,
                              value: attachmentsValue
                            }
                          ].map((spec) => (
                            <div key={spec.label} className="border-r border-ink/8 px-2 py-3 last:border-r-0">
                              <dt className="text-[9px] font-black uppercase leading-tight text-ink/42">{spec.label}</dt>
                              <dd className="mt-1.5 text-xs font-black leading-tight text-ink">{spec.value}</dd>
                            </div>
                          ))}
                        </dl>
                        <div className="mt-5 grid grid-cols-2 gap-3 border-y border-ink/8 py-4">
                          <div>
                            <p className="text-xs font-bold text-ink/48">1 час</p>
                            <p className="mt-1 text-lg font-black text-ink">от {formatPrice(hourlyPrice)}</p>
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

          <div className="relative isolate mx-auto hidden overflow-hidden rounded-[26px] bg-white shadow-soft md:block md:h-[720px] lg:h-[760px] lg:rounded-[30px] xl:h-[820px] 2xl:h-[880px]">
            <img
              src="/images/equipment/hero-mini-equipment.png"
              alt=""
              className="absolute inset-y-0 right-0 hidden h-full w-[61.5%] object-cover object-[100%_50%] md:block"
              loading="eager"
            />
            <span
              className="absolute inset-0 hidden md:block"
              style={{
                background:
                  "linear-gradient(90deg, #fff 0%, #fff 34%, rgba(255,255,255,.94) 43%, rgba(255,255,255,.62) 50%, rgba(255,255,255,.05) 62%, rgba(255,255,255,0) 100%)"
              }}
            />
            <span className="absolute inset-x-0 bottom-0 hidden h-[21%] bg-gradient-to-t from-white via-white/70 to-transparent md:block" />

            <div className="relative z-10 flex flex-col px-5 py-8 md:h-full md:w-[49%] md:px-16 md:pb-28 md:pt-14 lg:px-20 xl:px-[68px] xl:pt-16">
              <p className="inline-flex w-fit items-center gap-3 text-sm font-black text-ink/72 md:text-base">
                <span className="grid size-7 place-items-center rounded-full border-2 border-accent/45 text-accent">
                  <ShieldCheck size={16} />
                </span>
                Аренда спецтехники с доставкой по Минску и Беларуси
              </p>
              <div className="mt-5 rounded-[14px] border border-ink/8 bg-paper px-4 py-3 md:hidden">
                <p className="text-sm font-black leading-5 text-ink">
                  Arentex.by — сервис аренды мини-техники для стройки и участка.
                </p>
                <p className="mt-1.5 text-xs font-semibold leading-5 text-ink/62">
                  Подберём машину под задачу, согласуем доставку на объект и поможем с оператором.
                </p>
                <Button href="#lead" className="mt-3 h-11 w-full gap-2 rounded-[10px] px-5 text-sm font-black">
                  Быстрая заявка
                </Button>
              </div>
              <h1 className="mt-5 text-[38px] font-black leading-[1.12] tracking-normal md:mt-8 md:text-[48px] lg:text-[48px] xl:text-[48px] 2xl:text-[68px]">
                Мини-экскаваторы, мини-погрузчики и навесное оборудование в аренду{" "}
                <span className="block text-accent">с доставкой</span>
              </h1>
              <p className="mt-4 max-w-[670px] text-base font-semibold leading-7 text-ink/72 md:mt-5 md:text-lg lg:text-[19px] lg:leading-[1.55] 2xl:mt-8 2xl:text-[21px] 2xl:leading-[1.62]">
                Предоставляем исправную технику с оператором. Возможна договорная цена под объём и срок аренды.
              </p>
              <div className="mt-6 grid max-w-[790px] grid-cols-1 gap-4 sm:grid-cols-3 md:mt-7 md:gap-5 2xl:mt-11 2xl:gap-7">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div key={value} className="flex items-center gap-5">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-accent/65 text-accent md:size-11 2xl:size-[56px]">
                      <Icon className="size-6 2xl:size-7" />
                    </span>
                    <div>
                      <p className="whitespace-nowrap text-2xl font-black leading-none md:text-[26px] 2xl:text-[30px]">{value}</p>
                      <p className="mt-1 text-sm font-semibold leading-4 text-ink/62 md:text-sm 2xl:text-base">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row md:mt-8 md:gap-4 2xl:mt-14">
                <Button
                  href="#lead"
                  variant="outline"
                  className="h-[52px] rounded-[12px] px-7 text-base font-black md:h-14 md:px-9 2xl:h-[64px] 2xl:px-14 2xl:text-xl"
                >
                  Оставить заявку
                </Button>
              </div>

            </div>

            <div className="absolute bottom-[92px] right-9 z-20 hidden w-[50%] max-w-[1000px] md:block xl:right-10 2xl:w-[52%]">
              <QuickRequestForm />
            </div>

            <div className="absolute bottom-7 left-[43%] right-7 z-20 hidden items-center justify-between gap-4 text-[13px] font-bold text-ink/62 md:flex xl:left-[45%] xl:gap-5 xl:text-[14px] 2xl:left-[46%] 2xl:text-[15px]">
              {heroTrustItems.map((item) => (
                <span key={item} className="flex items-center gap-2 whitespace-nowrap">
                  <BadgeCheck size={18} className="shrink-0 text-accent xl:size-5" /> {item}
                </span>
              ))}
            </div>
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
                    Быстрая заявка
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
