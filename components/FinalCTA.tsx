import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { leadSchema, submitLead, type LeadFormValues } from "@/lib/forms";
import { Button } from "./Button";

const ctaBenefits = [
  "Быстрый подбор техники",
  "Техника в наличии и готова к работе",
  "Прозрачные цены без скрытых платежей"
];

export function FinalCTA() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      task: "Финальный CTA: срочная связь",
      equipmentId: "",
      sourcePage: "home",
      selectedEquipment: [],
      formType: "final-cta",
      utm: {}
    }
  });

  async function onSubmit(values: LeadFormValues) {
    await submitLead({ ...values, task: values.task || "Финальный CTA: срочная связь" });
    setSent(true);
    reset();
  }

  return (
    <section id="contacts" className="w-full content-gutter pb-10 pt-4 md:pb-14 md:pt-6">
      <div className="relative isolate mx-auto max-w-none overflow-hidden rounded-[14px] bg-night p-5 text-white shadow-[0_30px_90px_rgba(23,27,22,0.28),0_10px_28px_rgba(23,27,22,0.16)] md:rounded-[16px] lg:h-[392px] lg:p-[66px_76px]">
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
          <h2 className="text-[30px] font-black leading-tight md:text-[42px]">Готовы приступить к работе?</h2>
          <p className="mt-3 max-w-[620px] text-sm font-semibold leading-6 text-white/72 md:mt-4 md:text-xl md:leading-9">
            Оставьте заявку прямо сейчас — подберём технику и рассчитаем стоимость за 15 минут.
          </p>
          <div className="mt-5 grid max-w-[720px] gap-3 text-sm font-bold leading-5 text-white/70 sm:grid-cols-3 md:mt-10 md:gap-6 md:text-base md:leading-7">
            {ctaBenefits.map((item, index) => (
              <span key={item} className="flex items-center gap-3 md:gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-night md:size-11">
                  {index === 0 ? <Zap size={19} className="md:size-[23px]" /> : <ShieldCheck size={19} className="md:size-[23px]" />}
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 max-w-[590px] md:mt-8 lg:absolute lg:right-[76px] lg:top-[62px] lg:mt-0 lg:w-[590px]"
        >
          <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
            <input
              className="focus-ring h-12 rounded-[8px] border border-white/22 bg-night/72 px-4 text-sm font-bold text-white placeholder:text-white/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_35px_rgba(0,0,0,0.22)] backdrop-blur md:h-[80px] md:px-6 md:text-lg"
              style={{ backgroundColor: "rgba(23, 27, 22, 0.78)" }}
              placeholder="Ваше имя"
              {...register("name")}
            />
            <input
              className="focus-ring h-12 rounded-[8px] border border-white/22 bg-night/72 px-4 text-sm font-bold text-white placeholder:text-white/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_35px_rgba(0,0,0,0.22)] backdrop-blur md:h-[80px] md:px-6 md:text-lg"
              style={{ backgroundColor: "rgba(23, 27, 22, 0.78)" }}
              placeholder="Телефон"
              {...register("phone")}
            />
          </div>
          <input type="hidden" {...register("task")} />
          {errors.phone ? <p className="mt-2 text-sm font-bold text-accent">{errors.phone.message}</p> : null}
          <Button type="submit" disabled={isSubmitting} className="mt-3 h-12 w-full rounded-[8px] text-sm font-black shadow-[0_18px_38px_rgba(240,180,41,0.26)] md:mt-4 md:h-[76px] md:text-xl">
            {isSubmitting ? "Отправляем..." : "Оставить заявку"}
          </Button>
          <p className="mt-4 max-w-[590px] text-xs font-semibold leading-5 text-white/58 md:mt-7 md:text-base md:leading-8">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
          </p>
          {sent ? <p className="mt-3 text-base font-black text-accent">Заявка отправлена. Скоро свяжемся.</p> : null}
        </form>
      </div>
    </section>
  );
}
