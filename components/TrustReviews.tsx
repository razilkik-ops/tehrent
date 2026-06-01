import { ChevronRight, Star } from "lucide-react";
import { Button } from "./Button";

const reviews = [
  {
    logo: "✺",
    logoClass: "bg-blue-100 text-blue-500",
    company: "СтройИнвест",
    type: "Строительная компания",
    text: "Арендуем технику на постоянной основе. Всегда исправная техника и быстрая подача.",
    name: "Иван Петров",
    role: "Прораб"
  },
  {
    logo: "♣",
    logoClass: "bg-green-100 text-moss",
    company: "ГринЛэнд",
    type: "Благоустройство территорий",
    text: "Надёжный партнёр. Гибкие условия и адекватные цены. Рекомендуем!",
    name: "Алексей Сидоров",
    role: "Руководитель проекта"
  },
  {
    logo: "✦",
    logoClass: "bg-amber-100 text-accent",
    company: "МосКомСервис",
    type: "Коммунальные услуги",
    text: "Выручают 24/7. Особенно ценится отношение к клиентам и операторы.",
    name: "Ольга Смирнова",
    role: "Диспетчер"
  }
];

export function TrustReviews() {
  return (
    <section id="reviews" className="w-full content-gutter py-12">
      <div className="relative mx-auto grid max-w-none gap-7 rounded-[18px] bg-white/76 p-8 shadow-soft lg:grid-cols-[330px_1fr] xl:p-10">
        <div className="flex flex-col justify-center">
          <h2 className="text-[34px] font-black leading-tight">Нам доверяют</h2>
          <p className="mt-8 text-xl font-black leading-8 text-ink/78">
            <span className="text-[34px] text-accent">300+</span> компаний уже
            <br />
            работают с нами
          </p>
          <div className="mt-8 h-px w-[250px] bg-ink/10" />
          <Button href="#reviews" variant="outline" className="mt-6 h-[62px] w-[250px] rounded-[8px] text-base">
            Смотреть все отзывы
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.company} className="rounded-[12px] border border-ink/8 bg-white p-8 shadow-card">
              <div className="flex items-start gap-5">
                <span className={`grid size-12 shrink-0 place-items-center rounded-[10px] text-2xl ${review.logoClass}`}>
                  {review.logo}
                </span>
                <div>
                  <h3 className="text-xl font-black">{review.company}</h3>
                  <p className="mt-1 text-base font-semibold text-ink/50">{review.type}</p>
                </div>
              </div>
              <p className="mt-8 min-h-[96px] text-lg font-bold leading-8 text-ink/68">{review.text}</p>
              <div className="mt-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-lg font-black">{review.name}</p>
                  <p className="mt-1 text-base font-semibold text-ink/50">{review.role}</p>
                </div>
                <div className="flex text-accent">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={18} fill="currentColor" />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          aria-label="Следующий отзыв"
          className="absolute right-[-22px] top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-ink/10 bg-white text-ink shadow-card xl:grid"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
