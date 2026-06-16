import { z } from "zod";
import { buildAppPath } from "./site-paths";

const belarusPhonePattern = /^\+375(?:25|29|33|44)\d{7}$/;
const belarusPhoneMessage = "Введите номер в формате +375291234567";

const phoneSchema = z
  .string()
  .trim()
  .min(1, "Введите телефон")
  .refine((value) => belarusPhonePattern.test(value), belarusPhoneMessage);

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

const leadEndpoint = import.meta.env.VITE_LEAD_ENDPOINT?.trim() || "/api/leads.php";

export async function submitLead(values: LeadFormValues) {
  const response = await fetch(buildAppPath(leadEndpoint), {
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
