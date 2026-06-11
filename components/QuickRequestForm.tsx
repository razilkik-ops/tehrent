import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { leadSchema, submitLead, type LeadFormValues } from "@/lib/forms";
import { Button } from "./Button";

export function QuickRequestForm({ sourcePage = "home", id = "lead" }: { sourcePage?: string; id?: string }) {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      phone: "",
      task: "",
      equipmentId: "",
      sourcePage,
      selectedEquipment: [],
      formType: "quick-request",
      utm: {}
    }
  });

  async function onSubmit(values: LeadFormValues) {
    await submitLead(values);
    setSent(true);
    reset();
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[14px] border-0 bg-night/95 p-4 text-white shadow-[0_18px_45px_rgba(0,0,0,0.28)] outline-none ring-0 focus-within:outline-none focus-within:ring-0 md:rounded-[18px] md:p-4 2xl:p-5"
    >
      <div className="flex items-center gap-2 text-xl font-black leading-none md:text-[22px] 2xl:text-[24px]">
        <Search size={22} className="text-accent md:size-6" />
        <span>Быстрый подбор техники</span>
      </div>
      <p className="mt-2 text-sm font-semibold leading-5 text-white/68 md:text-sm 2xl:text-[15px]">
        Оставьте телефон — мы перезвоним и подберём технику за 15 минут
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_1fr_150px] 2xl:grid-cols-[1fr_1fr_1fr_185px]">
        <input
          className="focus-ring h-14 min-w-0 rounded-[10px] border border-white/10 bg-white/10 px-4 text-base font-semibold text-white placeholder:text-white/44 md:h-14 md:rounded-[12px] md:text-[15px] 2xl:h-16 2xl:text-base"
          placeholder="Ваше имя"
          {...register("name")}
        />
        <input
          className="focus-ring h-14 min-w-0 rounded-[10px] border border-white/10 bg-white/10 px-4 text-base font-semibold text-white placeholder:text-white/44 md:h-14 md:rounded-[12px] md:text-[15px] 2xl:h-16 2xl:text-base"
          placeholder="Телефон"
          {...register("phone")}
        />
        <input
          className="focus-ring h-14 min-w-0 rounded-[10px] border border-white/10 bg-white/10 px-4 text-base font-semibold text-white placeholder:text-white/44 md:h-14 md:rounded-[12px] md:text-[15px] 2xl:h-16 2xl:text-base"
          placeholder="Задача / объект"
          {...register("task")}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-14 min-w-0 rounded-[10px] px-4 text-base font-black md:h-14 md:rounded-[12px] md:text-[15px] 2xl:h-16 2xl:text-base"
        >
          {isSubmitting ? "..." : "Подобрать"}
        </Button>
      </div>
      {errors.phone || errors.task ? (
        <p className="mt-2 text-xs text-accent">{errors.phone?.message || errors.task?.message}</p>
      ) : null}
      {sent ? <p className="mt-2 text-xs text-accent">Заказ отправлен. Скоро свяжемся.</p> : null}
    </form>
  );
}
