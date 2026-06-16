import { CheckCircle2 } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
import { EquipmentDetailHero } from "@/components/EquipmentDetailHero";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useOrderModal } from "@/components/OrderModal";
import { RelatedEquipment } from "@/components/RelatedEquipment";
import { SpecsTable } from "@/components/SpecsTable";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { useEquipmentCatalog } from "@/lib/equipment-catalog";
import { getEquipmentMeta, toAbsoluteUrl } from "@/lib/seo.js";
import { usePageMeta } from "@/src/usePageMeta";

export function EquipmentPage() {
  const { slug = "" } = useParams();
  const { openOrderModal } = useOrderModal();
  const { getEquipmentBySlug } = useEquipmentCatalog();
  const item = getEquipmentBySlug(slug);

  usePageMeta(
    item
      ? getEquipmentMeta(item)
      : {
          title: "Техника не найдена | Arentex.by",
          description: "Запрошенная техника не найдена в каталоге Arentex.by.",
          canonical: toAbsoluteUrl("/"),
          robots: "noindex, follow",
          type: "website",
          structuredData: []
        }
  );

  if (item && slug !== item.slug) {
    return <Navigate to={`/equipment/${item.slug}`} replace />;
  }

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
        <EquipmentDetailHero
          item={item}
          onOrderClick={() =>
            openOrderModal({
              sourcePage: `/equipment/${item.slug}`,
              equipmentId: item.id,
              selectedEquipment: [item.id],
              formType: "equipment-detail-order",
              hiddenTask: `Заказать ${item.title}`
            })
          }
        />

        <section className="container-page py-8">
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
              {item.description ||
                `${item.title} подходит для строительных бригад, коммунальных служб и частных проектов. Техника поставляется в исправном состоянии, а диспетчер помогает подобрать навесное оборудование под конкретную задачу.`}
            </p>
            <p className="mt-4 text-base leading-8 text-ink/68">
              {[
                item.deliveryAvailable ? "Доставка согласуется заранее" : null,
                item.withOperatorAvailable ? "можно заказать технику с оператором" : null,
                "срок аренды подбирается под вашу задачу"
              ]
                .filter(Boolean)
                .join(", ")
                .replace(/^./, (char) => char.toUpperCase()) + "."}
            </p>
          </div>
        </section>

        <SpecsTable item={item} />
        <RelatedEquipment current={item} />
      </main>
      <Footer />
      <StickyMobileCTA sourcePage={`/equipment/${item.slug}`} />
    </>
  );
}
