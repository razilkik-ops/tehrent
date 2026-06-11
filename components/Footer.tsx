import { MessageCircle, Send, Youtube } from "lucide-react";
import { Logo } from "./Header";

export function Footer() {
  const clientLinks = [
    { label: "Услуги", href: "/#services" },
    { label: "О компании", href: "/#about" },
    { label: "Контакты", href: "/#contacts" }
  ];

  return (
    <footer className="bg-night text-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.1fr_1.35fr_1.1fr] md:gap-5 md:py-2 xl:grid-cols-[1.2fr_2fr_1.2fr] xl:gap-10 xl:py-12">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/62 md:mt-1.5 md:text-[9px] md:leading-4 xl:mt-5 xl:text-sm xl:leading-6">
            Аренда спецтехники с оператором, доставкой и понятным расчетом под задачу.
          </p>
          <div className="mt-5 flex gap-3 md:mt-1.5 md:gap-2 xl:mt-6 xl:gap-3">
            {[Send, MessageCircle, Youtube].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-accent hover:text-night md:h-6 md:w-6 xl:h-10 xl:w-10"
                aria-label="Социальная сеть"
              >
                <Icon className="size-4 xl:size-[18px]" />
              </a>
            ))}
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 md:gap-5 xl:gap-8">
          <div>
            <h3 className="font-black md:text-xs xl:text-base">Техника</h3>
            <div className="mt-4 grid gap-2 text-sm text-white/62 md:mt-1 md:gap-0 md:text-[9px] xl:mt-4 xl:gap-2 xl:text-sm">
              {["Мини-экскаваторы", "Мини-погрузчики", "Бурение", "Планировка", "Вывоз грунта"].map(
                (item) => (
                  <a href="/#services" key={item} className="hover:text-white">
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
          <div>
            <h3 className="font-black md:text-xs xl:text-base">Клиентам</h3>
            <div className="mt-4 grid gap-2 text-sm text-white/62 md:mt-1 md:gap-0 md:text-[9px] xl:mt-4 xl:gap-2 xl:text-sm">
              {clientLinks.map((item) => (
                <a href={item.href} key={item.label} className="hover:text-white">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-black md:text-xs xl:text-base">Контакты</h3>
          <div className="mt-4 grid gap-2 text-sm text-white/68 md:mt-1 md:gap-0 md:text-[9px] xl:mt-4 xl:gap-2 xl:text-sm">
            <a className="text-lg font-black text-white md:text-sm xl:text-lg" href="tel:+3752920958258">
              +375 (29) 209-58-25
            </a>
            <span>ежедневно 8:00–22:00</span>
            <a href="mailto:info@arentex.by">info@arentex.by</a>
            <span>г. Минск, ул. Строителей, 15</span>
            <span className="mt-2 text-white/78">Индивидуальный предприниматель Силко А.А.</span>
            <span>УНП 192947174</span>
            <span className="break-all">р/с BY25PJCB30130688200000000933</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 md:py-1 xl:py-5">
        <div className="container-page flex flex-col gap-2 text-xs text-white/42 sm:flex-row sm:justify-between">
          <span>© Arentex.by, 2026</span>
          <span>Политика конфиденциальности</span>
        </div>
      </div>
    </footer>
  );
}
