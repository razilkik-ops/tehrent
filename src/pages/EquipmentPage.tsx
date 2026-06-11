import { CheckCircle2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { EquipmentDetailHero } from "@/components/EquipmentDetailHero";
import { EquipmentVisual } from "@/components/EquipmentVisual";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LeadForm } from "@/components/LeadForm";
import { RelatedEquipment } from "@/components/RelatedEquipment";
import { SpecsTable } from "@/components/SpecsTable";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { formatPrice, getEquipmentBySlug } from "@/lib/equipment";
import { usePageMeta } from "@/src/usePageMeta";

export function EquipmentPage() {
  const { slug = "" } = useParams();
  const item = getEquipmentBySlug(slug);

  usePageMeta(
    item ? `${item.title} аренда | Arentex.by` : "Техника не найдена | Arentex.by",
    item
      ? `${item.title} в аренду: ${item.shortDescription} Цена от ${formatPrice(item.pricePerShift)} за смену.`
      : "Запрошенная техника не найдена в каталоге."
  );

  if (!item) {
    return (
      <>
        <Header />
        <main className="container-page py-20">
          <h1 className="text-4xl font-black">Техника не найдена</h1>
          <p className="mt-4 text-ink/62">Позиция отсутствует в каталоге или была снята с аренды.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <EquipmentDetailHero item={item} />

        <section className="container-page grid gap-5 py-8 md:grid-cols-[1fr_0.75fr]">
          <div className="rounded-[28px] bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap gap-3">
              {["Описание", "Характеристики", "Навесное", "Доставка"].map((tab, index) => (
                <span
                  key={tab}
                  className={`rounded-2xl px-5 py-3 text-sm font-black ${
                    index === 0 ? "bg-accent" : "border border-ink/10 bg-white"
                  }`}
                >
                  {tab}
                </span>
              ))}
            </div>
            <h2 className="mt-8 text-3xl font-black">Для каких работ подходит</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {item.useCases.map((useCase) => (
                <div key={useCase} className="flex items-center gap-3 rounded-2xl bg-paper p-4 font-bold">
                  <CheckCircle2 className="text-accent" size={20} />
                  {useCase}
                </div>
              ))}
            </div>
            <p className="mt-8 text-base leading-8 text-ink/68">
              {item.title} подходит для строительных бригад, коммунальных служб и частных проектов.
              Техника поставляется в исправном состоянии, а диспетчер помогает подобрать навесное
              оборудование под конкретную задачу.
            </p>
            <p className="mt-4 text-base leading-8 text-ink/68">
              Доставка, оператор и срок аренды согласуются заранее, чтобы смена прошла без простоя.
            </p>
          </div>
          <div id="equipment-lead">
            <LeadForm
              title="Уточните наличие и цену"
              description="Оставьте телефон, диспетчер свяжется с вами в течение 15 минут."
              sourcePage={`/equipment/${item.slug}`}
              formType="equipment-detail"
              equipmentId={item.id}
              selectedEquipment={[item.id]}
              dark
            />
          </div>
        </section>

        <SpecsTable item={item} />
        <RelatedEquipment current={item} />

        <section className="container-page pb-16">
          <div className="relative isolate grid gap-6 overflow-hidden rounded-[32px] bg-night p-6 text-white shadow-soft md:grid-cols-[1fr_auto] md:items-center lg:p-10">
            <EquipmentVisual
              type={item.imagePlaceholderType}
              imageUrl={item.imageUrl}
              variant="dark"
              className="absolute inset-y-0 right-0 -z-10 hidden min-h-0 w-1/2 rounded-none opacity-72 lg:block"
            />
            <div>
              <h2 className="text-3xl font-black">Готовы забронировать технику?</h2>
              <p className="mt-3 text-sm leading-6 text-white/62">
                Оставьте телефон, диспетчер уточнит наличие, адрес подачи и финальную стоимость.
              </p>
            </div>
            <LeadForm
              sourcePage={`/equipment/${item.slug}`}
              formType="equipment-final"
              equipmentId={item.id}
              selectedEquipment={[item.id]}
              dark
              compact
            />
          </div>
        </section>
      </main>
      <Footer />
      <StickyMobileCTA target="#equipment-lead" />
    </>
  );
}
