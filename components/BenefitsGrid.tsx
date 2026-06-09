import { BadgeDollarSign, BadgeHelp, Clock3, Headphones, IdCard, Wrench } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

const benefits = [
  { icon: BadgeHelp, title: "Более 10 лет", text: "на рынке аренды спецтехники" },
  { icon: Clock3, title: "Подача в день", text: "обращения от 2 часов" },
  { icon: IdCard, title: "Опытные операторы", text: "с удостоверениями и стажем" },
  { icon: Wrench, title: "Исправная техника", text: "регулярное ТО и диагностика" },
  { icon: BadgeDollarSign, title: "Гибкие условия", text: "аренды без переплат" },
  { icon: Headphones, title: "Поддержка 24/7", text: "на всех этапах работы" }
];

export function BenefitsGrid() {
  return (
    <section id="about" className="w-full content-gutter py-12">
      <div className="mx-auto max-w-none">
        <SectionTitle title="Почему выбирают ТехПрокат" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex min-h-[150px] items-center gap-5 rounded-[12px] border border-ink/8 bg-white p-6 shadow-card">
              <Icon className="shrink-0 text-accent" size={40} strokeWidth={1.9} />
              <div>
                <h3 className="text-lg font-black leading-tight">{title}</h3>
                <p className="mt-2 text-base font-semibold leading-6 text-ink/58">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
