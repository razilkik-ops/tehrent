import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";
import { useOrderModal } from "./OrderModal";

const nav = [
  { href: "/#services", label: "Услуги" },
  { href: "/#about", label: "О компании" },
  { href: "/#contacts", label: "Контакты" }
];

export function Logo() {
  return (
    <a href="/" className="flex shrink-0 items-center gap-2 md:gap-2.5" aria-label="Arentex.by на главную">
      <span className="grid h-9 w-9 place-items-center rounded-[9px] bg-accent text-night shadow-card md:h-[34px] md:w-[34px] xl:h-[44px] xl:w-[44px]">
        <span className="h-0 w-0 border-x-[6px] border-b-[15px] border-x-transparent border-b-night xl:border-x-[7px] xl:border-b-[18px]" />
      </span>
      <span>
        <span className="block text-base font-black leading-none max-[340px]:text-[13px] md:text-[18px] xl:text-[22px]">Arentex.by</span>
        <span className="hidden text-[10px] font-semibold uppercase leading-none text-ink/54 min-[430px]:inline xl:text-[11px]">Аренда спецтехники</span>
      </span>
    </a>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { openOrderModal } = useOrderModal();

  function handleOrderClick(sourcePage: string) {
    setOpen(false);
    openOrderModal({
      sourcePage,
      formType: "header-order",
      hiddenTask: "Заявка из шапки сайта"
    });
  }

  return (
    <header className="sticky top-0 z-50 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-2 px-3 max-[340px]:gap-1 max-[340px]:px-2 sm:px-6 md:h-16 md:gap-4 md:px-[30px] lg:px-[30px]">
        <Logo />
        <nav className="hidden items-center gap-5 text-[12px] font-semibold text-ink/78 md:flex lg:gap-8 xl:gap-12 xl:text-sm">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex xl:gap-5">
          <a href="tel:+375299209582" className="flex items-start gap-1.5 text-left">
            <Phone size={14} className="mt-0.5 shrink-0 text-ink xl:size-[18px]" />
            <span>
              <span className="block whitespace-nowrap text-[12px] font-black leading-4 xl:text-sm">+375 (29) 920-95-82</span>
              <span className="whitespace-nowrap text-[10px] text-ink/52 xl:text-xs">Ежедневно с 8:00 до 20:00</span>
            </span>
          </a>
          <Button
            type="button"
            size="sm"
            className="h-9 rounded-[8px] px-4 text-[11px] xl:h-12 xl:px-7 xl:text-xs"
            onClick={() => handleOrderClick("header-desktop")}
          >
            Заказать
          </Button>
        </div>
        <a
          href="tel:+375299209582"
          className="ml-auto inline-flex h-9 items-center gap-1 rounded-[10px] border border-accent/55 bg-[rgba(240,180,41,0.12)] px-2 text-[10px] font-black leading-none text-ink shadow-[0_8px_18px_rgba(240,180,41,0.14)] max-[340px]:gap-0.5 max-[340px]:px-1.5 max-[340px]:text-[9px] min-[380px]:h-10 min-[380px]:gap-1.5 min-[380px]:px-2.5 min-[380px]:text-[11px] md:hidden"
          aria-label="Позвонить +375 (29) 920-95-82"
        >
          <Phone size={14} className="shrink-0 text-accent" />
          <span className="whitespace-nowrap">+375 29 920-95-82</span>
        </a>
        <button
          className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-accent/55 bg-[rgba(240,180,41,0.12)] text-ink shadow-[0_8px_18px_rgba(240,180,41,0.14)] max-[340px]:h-9 max-[340px]:w-9 md:hidden"
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
              href="tel:+375299209582"
            >
              <Phone size={18} /> +375 (29) 920-95-82
            </a>
            <Button type="button" className="mt-1 rounded-[12px]" onClick={() => handleOrderClick("header-mobile")}>
              Заказать
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
