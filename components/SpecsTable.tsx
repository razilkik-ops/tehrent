import type { Equipment } from "@/lib/equipment";

export function SpecsTable({ item }: { item: Equipment }) {
  const entries = Object.entries(item.specs);
  const first = entries.slice(0, Math.ceil(entries.length / 2));
  const second = entries.slice(Math.ceil(entries.length / 2));

  return (
    <section className="container-page py-8">
      <div className="rounded-[28px] bg-white p-6 shadow-card sm:p-8">
        <h2 className="text-2xl font-black">Технические параметры</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {[first, second].map((group, index) => (
            <dl key={index} className="grid gap-0">
              {group.map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 gap-4 border-b border-ink/10 py-3 text-sm">
                  <dt className="font-bold">{key}</dt>
                  <dd className="text-ink/68">{value}</dd>
                </div>
              ))}
            </dl>
          ))}
        </div>
      </div>
    </section>
  );
}
