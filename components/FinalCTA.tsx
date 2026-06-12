import { ShieldCheck, Zap } from "lucide-react";
import { Button } from "./Button";
import { useOrderModal } from "./OrderModal";

const ctaBenefits = [
  "Быстрый подбор техники",
  "Техника в наличии и готова к работе",
  "Прозрачные цены без скрытых платежей"
];

export function FinalCTA() {
  const { openOrderModal } = useOrderModal();

  return (
    <section id="contacts" className="w-full content-gutter pb-10 pt-3 md:pb-14 md:pt-6">
      <div className="relative isolate mx-auto max-w-none overflow-hidden rounded-[14px] bg-night p-4 text-white shadow-[0_30px_90px_rgba(23,27,22,0.28),0_10px_28px_rgba(23,27,22,0.16)] md:rounded-[16px] md:p-5 lg:h-[392px] lg:p-[66px_76px]">
        <img
          src="/images/equipment/hero-excavator.png"
          alt=""
          className="absolute inset-y-0 right-0 -z-10 hidden h-full w-[48%] object-cover object-[80%_50%] opacity-95 lg:block"
        />
        <span
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(90deg, #171b16 0%, #171b16 42%, rgba(23,27,22,0.99) 51%, rgba(23,27,22,0.9) 61%, rgba(23,27,22,0.62) 72%, rgba(23,27,22,0.2) 86%, rgba(23,27,22,0.08) 100%)"
          }}
        />
        <span
          className="absolute inset-y-0 right-0 -z-10 hidden w-[58%] lg:block"
          style={{
            background:
              "radial-gradient(circle at 76% 50%, rgba(255,255,255,0.06), transparent 25rem), linear-gradient(90deg, rgba(23,27,22,0.96) 0%, rgba(23,27,22,0.6) 34%, rgba(23,27,22,0.18) 64%, rgba(23,27,22,0.08) 100%)"
          }}
        />
        <span className="pointer-events-none absolute inset-x-0 top-0 z-0 h-px bg-white/35" />
        <span className="pointer-events-none absolute inset-x-8 bottom-[-24px] -z-20 hidden h-16 rounded-full bg-night/35 blur-3xl lg:block" />

        <div className="max-w-[700px]">
          <h2 className="text-[26px] font-black leading-tight md:text-[42px]">Готовы приступить к работе?</h2>
          <p className="mt-2 max-w-[620px] text-[13px] font-semibold leading-5 text-white/72 md:mt-4 md:text-xl md:leading-9">
            Оставьте телефон прямо сейчас — подберём технику и рассчитаем стоимость за 15 минут.
          </p>
          <div className="mt-4 grid max-w-[720px] gap-2.5 text-xs font-bold leading-5 text-white/70 sm:grid-cols-3 md:mt-10 md:gap-6 md:text-base md:leading-7">
            {ctaBenefits.map((item, index) => (
              <span key={item} className="flex items-center gap-2.5 md:gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-night md:size-11">
                  {index === 0 ? <Zap size={19} className="md:size-[23px]" /> : <ShieldCheck size={19} className="md:size-[23px]" />}
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 max-w-[590px] md:mt-8 lg:absolute lg:right-[76px] lg:top-[96px] lg:mt-0 lg:w-[420px]">
          <Button
            type="button"
            className="h-14 w-full rounded-[8px] text-base font-black shadow-[0_18px_38px_rgba(240,180,41,0.26)] md:h-[76px] md:text-xl"
            onClick={() =>
              openOrderModal({
                sourcePage: "home-final-cta",
                formType: "final-cta-order",
                hiddenTask: "Заявка из финального блока"
              })
            }
          >
            Заказать
          </Button>
          <p className="mt-3 max-w-[590px] text-[11px] font-semibold leading-4 text-white/58 md:mt-7 md:text-base md:leading-8">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
          </p>
        </div>
      </div>
    </section>
  );
}
