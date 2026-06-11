import { Phone } from "lucide-react";
import { Button } from "./Button";

export function StickyMobileCTA({ target = "/#mobile-lead" }: { target?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/94 p-3 shadow-soft backdrop-blur md:hidden">
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <Button href={target} className="w-full">
          Заказать
        </Button>
        <a
          href="tel:+3752920958258"
          className="grid h-12 w-12 place-items-center rounded-2xl bg-night text-white"
          aria-label="Позвонить"
        >
          <Phone size={19} />
        </a>
      </div>
    </div>
  );
}
