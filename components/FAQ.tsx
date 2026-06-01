import { ChevronRight } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { Button } from "./Button";

const items = [
  {
    question: "Какие документы нужны для аренды техники?"
  },
  {
    question: "Какие способы оплаты доступны?"
  },
  {
    question: "Можно ли арендовать технику с оператором?"
  },
  {
    question: "Что делать, если техника сломается?"
  },
  {
    question: "Как осуществляется доставка техники?"
  },
  {
    question: "Есть ли скидки при длительной аренде?"
  }
];

export function FAQ() {
  return (
    <section id="faq" className="w-full content-gutter py-12">
      <div className="mx-auto grid max-w-none gap-10 lg:grid-cols-[1fr_620px]">
        <div>
          <SectionTitle title="Часто задаваемые вопросы" />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <button
                key={item.question}
                type="button"
                className="focus-ring flex h-[72px] items-center justify-between gap-4 rounded-[8px] border border-ink/8 bg-white px-7 text-left text-lg font-black shadow-card transition hover:border-accent/50"
              >
                {item.question}
                <ChevronRight className="shrink-0 text-ink/42" size={24} />
              </button>
            ))}
          </div>
        </div>

        <aside className="relative isolate min-h-[360px] overflow-hidden rounded-[16px] bg-white p-10 shadow-soft">
          <div className="relative z-10 max-w-[330px]">
            <h3 className="text-[34px] font-black leading-tight">
              Не нашли ответ?
              <br />
              Мы поможем!
            </h3>
            <div className="mt-6 h-px w-24 bg-ink/10" />
            <p className="mt-6 text-xl font-semibold leading-8 text-ink/62">
              Оставьте заявку, и мы проконсультируем вас по любому вопросу.
            </p>
            <Button href="#lead" className="mt-10 h-[72px] rounded-[8px] px-10 text-lg font-black">
              Получить консультацию
            </Button>
          </div>
          <img
            src="/images/people/support-consultant.png"
            alt=""
            className="absolute bottom-0 right-0 z-0 h-[92%] max-w-[54%] object-contain object-bottom"
          />
        </aside>
      </div>
    </section>
  );
}
