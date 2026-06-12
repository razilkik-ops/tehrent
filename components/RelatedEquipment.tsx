import { formatPrice, getRelatedEquipment, type Equipment } from "@/lib/equipment";
import { Button } from "./Button";
import { EquipmentVisual } from "./EquipmentVisual";
import { useOrderModal } from "./OrderModal";

export function RelatedEquipment({ current }: { current: Equipment }) {
  const related = getRelatedEquipment(current);
  const { openOrderModal } = useOrderModal();

  return (
    <section className="container-page py-12">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl font-black">Похожие модели</h2>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {related.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-[24px] bg-white shadow-card">
            <EquipmentVisual
              type={item.imagePlaceholderType}
              imageUrl={item.imageUrl}
              imageBackdrop="none"
              className="aspect-[1200/751] !min-h-0 rounded-none"
            />
            <div className="p-5">
              <h3 className="text-xl font-black">{item.title}</h3>
              <p className="mt-2 font-bold text-ink/64">{item.priceLabel || `от ${formatPrice(item.pricePerShift)}/смена`}</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-ink/44">
                Ориентировочный расчет. Точная сумма по телефону.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-ink/60">
                {Object.entries(item.specs)
                  .slice(0, 3)
                  .map(([key, value]) => (
                    <li key={key}>✓ {key}: {value}</li>
                  ))}
              </ul>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button href={`/equipment/${item.slug}`} size="sm" variant="outline">
                  Подробнее
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    openOrderModal({
                      sourcePage: `/equipment/${current.slug}`,
                      equipmentId: item.id,
                      selectedEquipment: [item.id],
                      formType: "related-equipment-order",
                      hiddenTask: `Заказать ${item.title}`
                    })
                  }
                >
                  Заказать
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
