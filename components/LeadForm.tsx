import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { leadSchema, submitLead, type LeadFormValues } from "@/lib/forms";
import { Button } from "./Button";

type LeadFormProps = {
  title?: string;
  description?: string;
  sourcePage: string;
  formType: string;
  equipmentId?: string;
  selectedEquipment?: string[];
  dark?: boolean;
  compact?: boolean;
  minimal?: boolean;
};

export function LeadForm({
  title = "Оставьте заказ",
  description = "Диспетчер уточнит задачу, адрес и финальную стоимость.",
  sourcePage,
  formType,
  equipmentId,
  selectedEquipment = [],
  dark = false,
  compact = false,
  minimal = false
}: LeadFormProps) {
  const [sent, setSent] = useState(false);
  const defaults = useMemo<LeadFormValues>(
    () => ({
      name: "",
      phone: "",
      task: "",
      equipmentId: equipmentId ?? "",
      rentalPeriod: "",
      address: "",
      sourcePage,
      selectedEquipment,
      formType,
      utm: {}
    }),
    [equipmentId, formType, selectedEquipment, sourcePage]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: defaults
  });

  async function onSubmit(values: LeadFormValues) {
    await submitLead({
      ...values,
      equipmentId: equipmentId ?? values.equipmentId,
      selectedEquipment,
      sourcePage,
      formType,
      utm: {}
    });
    setSent(true);
    reset(defaults);
  }

  const fieldClass = dark
    ? "border-white/10 bg-white/10 text-white placeholder:text-white/44"
    : "border-ink/10 bg-white text-ink placeholder:text-ink/40";

  if (minimal) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-1.5">
        <input
          className={`focus-ring h-6 rounded-[6px] border px-3 text-[10px] font-semibold ${fieldClass}`}
          placeholder="Что нужно сделать?"
          {...register("task")}
        />
        <input
          className={`focus-ring h-6 rounded-[6px] border px-3 text-[10px] font-semibold ${fieldClass}`}
          placeholder="Телефон"
          {...register("phone")}
        />
        <input
          className={`focus-ring h-6 rounded-[6px] border px-3 text-[10px] font-semibold ${fieldClass}`}
          placeholder="Дата и адрес"
          {...register("address")}
        />
        <Button className="h-7 rounded-[6px] text-[10px]" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Отправляем..." : "Отправить заказ"}
        </Button>
      </form>
    );
  }

  if (sent) {
    return (
      <div
        className={`rounded-[28px] p-7 shadow-card ${
          dark ? "bg-night text-white" : "bg-white text-ink"
        }`}
      >
        <CheckCircle2 className="text-accent" size={34} />
        <h3 className="mt-5 text-2xl font-black">Заказ отправлен</h3>
        <p className={`mt-3 text-sm leading-6 ${dark ? "text-white/64" : "text-ink/62"}`}>
          Мы получили обращение и свяжемся с вами в ближайшее время.
        </p>
        <Button className="mt-6" type="button" onClick={() => setSent(false)} variant={dark ? "primary" : "dark"}>
          Отправить еще одну
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`rounded-[28px] p-6 shadow-card sm:p-8 ${
        dark ? "bg-night text-white" : "bg-white text-ink"
      }`}
    >
      <h3 className="text-2xl font-black">{title}</h3>
      <p className={`mt-3 text-sm leading-6 ${dark ? "text-white/64" : "text-ink/62"}`}>
        {description}
      </p>
      <div className={`mt-6 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        {!compact ? (
          <input
            className={`focus-ring h-12 rounded-2xl border px-4 ${fieldClass}`}
            placeholder="Имя"
            {...register("name")}
          />
        ) : null}
        <div>
          <input
            className={`focus-ring h-12 w-full rounded-2xl border px-4 ${fieldClass}`}
            placeholder="+375 (__) ___-__-__"
            {...register("phone")}
          />
          {errors.phone ? <p className="mt-1 text-xs text-accent">{errors.phone.message}</p> : null}
        </div>
        {equipmentId ? (
          <input type="hidden" value={equipmentId} {...register("equipmentId")} />
        ) : null}
        <input
          className={`focus-ring h-12 rounded-2xl border px-4 ${fieldClass}`}
          placeholder="Период аренды"
          {...register("rentalPeriod")}
        />
        <input
          className={`focus-ring h-12 rounded-2xl border px-4 ${fieldClass}`}
          placeholder="Дата и адрес"
          {...register("address")}
        />
      </div>
      <textarea
        className={`focus-ring mt-3 min-h-24 w-full rounded-2xl border px-4 py-3 ${fieldClass}`}
        placeholder="Что нужно сделать? Комментарий к заказу"
        {...register("task")}
      />
      {errors.task ? <p className="mt-1 text-xs text-accent">{errors.task.message}</p> : null}
      <Button className="mt-4 w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Отправляем..." : "Отправить заказ"}
      </Button>
      <p className={`mt-4 text-xs leading-5 ${dark ? "text-white/46" : "text-ink/46"}`}>
        Нажимая кнопку, вы соглашаетесь с политикой обработки данных.
      </p>
    </form>
  );
}
