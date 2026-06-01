import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .min(6, "Введите телефон")
  .refine((value) => value.replace(/[^\d+]/g, "").length >= 6, "Проверьте телефон");

export const leadSchema = z
  .object({
    name: z.string().trim().optional(),
    phone: phoneSchema,
    task: z.string().trim().optional(),
    equipmentId: z.string().trim().optional(),
    rentalPeriod: z.string().trim().optional(),
    address: z.string().trim().optional(),
    sourcePage: z.string(),
    selectedEquipment: z.array(z.string()).default([]),
    formType: z.string(),
    utm: z.record(z.string()).default({})
  })
  .refine((data) => Boolean(data.task?.length || data.equipmentId?.length), {
    message: "Опишите задачу или выберите технику",
    path: ["task"]
  });

export type LeadFormValues = z.infer<typeof leadSchema>;

export async function submitLead(values: LeadFormValues) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(values)
  });

  if (!response.ok) {
    throw new Error("Не удалось отправить заявку");
  }

  return response.json() as Promise<{ success: boolean }>;
}
