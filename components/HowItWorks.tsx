import { SectionTitle } from "./SectionTitle";

const steps = [
  { title: "Заявка", text: "Оставляете заявку на сайте или по телефону" },
  { title: "Подбор техники", text: "Менеджер подбирает оптимальный вариант" },
  { title: "Согласование условий", text: "Обсуждаем сроки, стоимость и доставку" },
  { title: "Доставка на объект", text: "Подача техники в оговоренное время" },
  { title: "Работа на объекте", text: "Вы выполняете задачу с нашей техникой" },
  { title: "Возврат техники", text: "Возврат по завершении работы" }
];

export function HowItWorks() {
  return (
    <section id="how" className="w-full content-gutter py-12">
      <div className="mx-auto max-w-none">
      <SectionTitle title="Как проходит аренда" />
      <div className="relative mt-14 grid gap-8 md:grid-cols-6">
        <span className="absolute left-0 right-0 top-[17px] hidden border-t-2 border-dashed border-accent/30 md:block" />
        {steps.map(({ title, text }, index) => (
          <div key={title} className="relative text-center">
            <span className="relative z-10 mx-auto grid h-9 w-9 place-items-center rounded-full bg-accent text-base font-black shadow-card">
                {index + 1}
              </span>
            <h3 className="mt-7 text-lg font-black">{title}</h3>
            <p className="mx-auto mt-3 max-w-[220px] text-base font-semibold leading-7 text-ink/58">{text}</p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
