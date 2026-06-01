import { ArrowRight, BadgeCheck, Clock3, ShieldCheck, Truck } from "lucide-react";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { Button } from "@/components/Button";
import { CalculatorBlock } from "@/components/CalculatorBlock";
import { CategorySlider } from "@/components/CategorySlider";
import { EquipmentVisual } from "@/components/EquipmentVisual";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HowItWorks } from "@/components/HowItWorks";
import { QuickRequestForm } from "@/components/QuickRequestForm";
import { SectionTitle } from "@/components/SectionTitle";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { TrustReviews } from "@/components/TrustReviews";
import { usePageMeta } from "@/src/usePageMeta";

const stats = [
  { icon: Truck, value: "150+", label: "единиц техники" },
  { icon: Clock3, value: "2 часа", label: "подача техники" },
  { icon: ShieldCheck, value: "24/7", label: "поддержка" }
];

const heroTrustItems = ["Собственный парк", "Исправная техника", "ТО по регламенту", "Быстрый выезд на объект"];

const cases = [
  "Строительство зданий и сооружений",
  "Благоустройство территорий",
  "Коммунальные работы",
  "Демонтаж и снос конструкций",
  "Промышленные объекты",
  "Складская и логистика"
];

export function HomePage() {
  usePageMeta(
    "Аренда спецтехники с доставкой | ТехПрокат",
    "Аренда мини-экскаваторов, мини-погрузчиков, автовышек, самосвалов и навесного оборудования с оператором."
  );

  return (
    <>
      <Header />
      <main>
        <section className="w-full content-gutter pt-0">
          <div className="relative isolate mx-auto overflow-hidden rounded-[26px] bg-white shadow-soft md:h-[720px] lg:h-[760px] lg:rounded-[30px] xl:h-[820px] 2xl:h-[880px]">
            <img
              src="/images/equipment/hero-excavator.png"
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
              <h1 className="mt-8 text-[42px] font-black leading-[1.12] tracking-normal md:text-[48px] lg:text-[48px] xl:text-[48px] 2xl:text-[68px]">
                Мини-экскаваторы, погрузчики и другая спецтехника в аренду{" "}
                <span className="block text-accent">с доставкой</span>
              </h1>
              <p className="mt-5 max-w-[670px] text-lg font-semibold leading-8 text-ink/72 md:text-lg lg:text-[19px] lg:leading-[1.55] 2xl:mt-8 2xl:text-[21px] 2xl:leading-[1.62]">
                Современная техника от проверенных поставщиков для любых задач. Подача в день
                обращения.
              </p>
              <div className="mt-7 grid max-w-[790px] grid-cols-1 gap-5 sm:grid-cols-3 md:gap-5 2xl:mt-11 2xl:gap-7">
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
              <div className="mt-8 flex flex-col gap-4 sm:flex-row 2xl:mt-14">
                <Button href="/catalog" className="h-14 rounded-[12px] px-9 text-base font-black 2xl:h-[64px] 2xl:px-14 2xl:text-xl">
                  Перейти в каталог
                </Button>
                <Button
                  href="#prices"
                  variant="outline"
                  className="h-14 rounded-[12px] px-9 text-base font-black 2xl:h-[64px] 2xl:px-14 2xl:text-xl"
                >
                  Рассчитать стоимость
                </Button>
              </div>

              <EquipmentVisual type="excavator" variant="hero" className="mt-8 min-h-[310px] md:hidden" />
              <div className="mt-5 md:hidden">
                <QuickRequestForm />
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
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-semibold text-ink/56 md:hidden">
            {heroTrustItems.map((item) => (
              <span key={item} className="flex items-center gap-1">
                <BadgeCheck size={15} className="text-accent" /> {item}
              </span>
            ))}
          </div>
        </section>

        <section id="services" className="w-full content-gutter py-12">
          <div className="mx-auto flex max-w-none flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionTitle title="Популярные категории" />
            <Button href="/catalog" variant="outline" className="h-auto border-none bg-transparent px-0 text-lg text-ink/72 hover:bg-transparent hover:text-ink">
              Смотреть весь каталог <ArrowRight size={17} />
            </Button>
          </div>
          <CategorySlider />
        </section>

        <CalculatorBlock />
        <BenefitsGrid />
        <HowItWorks />

        <section className="w-full content-gutter py-12">
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

        <TrustReviews />

        <FAQ />

        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
