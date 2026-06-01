import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";

const nav = [
  { href: "/catalog", label: "Каталог" },
  { href: "/#services", label: "Услуги" },
  { href: "/#delivery", label: "Доставка" },
  { href: "/#prices", label: "Цены" },
  { href: "/#about", label: "О компании" },
  { href: "/#contacts", label: "Контакты" }
];

export function Logo() {
  return (
    <a href="/" className="flex shrink-0 items-center gap-2.5" aria-label="ТехПрокат на главную">
      <span className="grid h-10 w-10 place-items-center rounded-[9px] bg-accent text-night shadow-card md:h-[34px] md:w-[34px] xl:h-[44px] xl:w-[44px]">
        <span className="h-0 w-0 border-x-[6px] border-b-[15px] border-x-transparent border-b-night xl:border-x-[7px] xl:border-b-[18px]" />
      </span>
      <span>
        <span className="block text-lg font-black leading-none md:text-[18px] xl:text-[22px]">ТехПрокат</span>
        <span className="text-[10px] font-semibold uppercase leading-none text-ink/54 xl:text-[11px]">Аренда спецтехники</span>
      </span>
    </a>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 md:h-16 md:px-[30px] lg:px-[30px]">
        <Logo />
        <nav className="hidden items-center gap-5 text-[12px] font-semibold text-ink/78 md:flex lg:gap-8 xl:gap-12 xl:text-sm">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex xl:gap-5">
          <a href="tel:+375291234567" className="flex items-start gap-1.5 text-left">
            <Phone size={14} className="mt-0.5 shrink-0 text-ink xl:size-[18px]" />
            <span>
              <span className="block whitespace-nowrap text-[12px] font-black leading-4 xl:text-sm">+375 (29) 123-45-67</span>
              <span className="whitespace-nowrap text-[10px] text-ink/52 xl:text-xs">Ежедневно с 8:00 до 20:00</span>
            </span>
          </a>
          <Button href="/#lead" size="sm" className="h-9 rounded-[8px] px-4 text-[11px] xl:h-12 xl:px-7 xl:text-xs">
            Оставить заявку
          </Button>
        </div>
        <button
          className="focus-ring grid h-11 w-11 place-items-center rounded-2xl border border-ink/12 bg-white md:hidden"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Открыть меню"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-ink/8 bg-paper md:hidden">
          <div className="container-page grid gap-3 py-5">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-2xl bg-white px-4 py-3 text-sm font-bold"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold"
              href="tel:+375291234567"
            >
              <Phone size={18} /> +375 (29) 123-45-67
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
