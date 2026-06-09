import { formatPrice, getRelatedEquipment, type Equipment } from "@/lib/equipment";
import { Button } from "./Button";
import { EquipmentVisual } from "./EquipmentVisual";

export function RelatedEquipment({ current }: { current: Equipment }) {
  const related = getRelatedEquipment(current);

  return (
    <section className="container-page py-12">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl font-black">Похожие модели</h2>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {related.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-[24px] bg-white shadow-card">
            <EquipmentVisual type={item.imagePlaceholderType} imageUrl={item.imageUrl} className="min-h-40 rounded-none" />
            <div className="p-5">
              <h3 className="text-xl font-black">{item.title}</h3>
              <p className="mt-2 font-bold text-ink/64">от {formatPrice(item.pricePerShift)}/смена</p>
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
                <Button href={`/equipment/${item.slug}#equipment-lead`} size="sm">
                  В заявку
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
