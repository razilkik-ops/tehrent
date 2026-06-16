import equipmentData from "../data/equipment.json";

export type Availability = "today" | "tomorrow" | "request";

export type ImagePlaceholderType = "excavator" | "loader" | "backhoe" | "lift" | "truck";

export type Equipment = {
  id: string;
  slug: string;
  legacySlugs?: string[];
  title: string;
  category: string;
  shortDescription: string;
  description?: string;
  hourlyPrice?: number;
  pricePerShift: number;
  priceLabel?: string;
  availability: Availability;
  specs: Record<string, string | number>;
  attachments: string[];
  useCases: string[];
  imagePlaceholderType: ImagePlaceholderType;
  imageUrl?: string;
  mobileImageUrl?: string;
  withOperatorAvailable: boolean;
  deliveryAvailable: boolean;
};

export const equipment = equipmentData as unknown as Equipment[];

export const categories = [
  "Мини-экскаваторы",
  "Мини-погрузчики",
  "Экскаваторы-погрузчики",
  "Фронтальные погрузчики",
  "Автовышки",
  "Самосвалы",
  "Катки",
  "Навесное оборудование"
];

export const availabilityLabels: Record<Availability, string> = {
  today: "В наличии",
  tomorrow: "Будет завтра",
  request: "Под заказ"
};

export function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-BY").format(value) + " руб";
}
