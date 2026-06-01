export type Availability = "today" | "tomorrow" | "request";

export type ImagePlaceholderType = "excavator" | "loader" | "lift" | "truck";

export type Equipment = {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  pricePerShift: number;
  availability: Availability;
  specs: Record<string, string | number>;
  attachments: string[];
  useCases: string[];
  imagePlaceholderType: ImagePlaceholderType;
  withOperatorAvailable: boolean;
  deliveryAvailable: boolean;
};

export const equipment: Equipment[] = [
  {
    id: "eq-bobcat-e35",
    slug: "bobcat-e35",
    title: "Bobcat E35",
    category: "Мини-экскаваторы",
    shortDescription:
      "Маневренный мини-экскаватор для траншей, котлованов и работ на ограниченной площадке.",
    pricePerShift: 12000,
    availability: "today",
    specs: {
      "Эксплуатационная масса": "3.5 т",
      "Глубина копания": "3.1 м",
      "Ширина гусениц": "300 мм",
      "Ширина прохода": "1.55 м",
      "Объем ковша": "0.11 м3",
      "Мощность двигателя": "24.2 л.с."
    },
    attachments: ["Ковш 30/40/60 см", "Гидромолот", "Ямобур"],
    useCases: [
      "Траншеи под коммуникации",
      "Подготовка фундамента",
      "Планировка участка",
      "Демонтаж с гидромолотом"
    ],
    imagePlaceholderType: "excavator",
    withOperatorAvailable: true,
    deliveryAvailable: true
  },
  {
    id: "eq-kubota-u27",
    slug: "kubota-u27",
    title: "Kubota U27",
    category: "Мини-экскаваторы",
    shortDescription:
      "Компактная модель с узким корпусом для дворов, садов и плотной городской застройки.",
    pricePerShift: 10500,
    availability: "today",
    specs: {
      "Эксплуатационная масса": "2.7 т",
      "Глубина копания": "2.8 м",
      "Ширина прохода": "1.5 м",
      "Объем ковша": "0.08 м3",
      "Радиус поворота": "компактный",
      "Тип хода": "гусеничный"
    },
    attachments: ["Ковши", "Ямобур"],
    useCases: ["Работы во дворе", "Благоустройство", "Траншеи до 2.8 м", "Посадочные ямы"],
    imagePlaceholderType: "excavator",
    withOperatorAvailable: true,
    deliveryAvailable: true
  },
  {
    id: "eq-jcb-1cx",
    slug: "jcb-1cx",
    title: "JCB 1CX",
    category: "Погрузчики",
    shortDescription:
      "Погрузчик-экскаватор для погрузки, планировки, уборки грунта и смешанных задач.",
    pricePerShift: 13500,
    availability: "today",
    specs: {
      "Эксплуатационная масса": "3.2 т",
      "Глубина копания": "2.5 м",
      "Ковш фронтальный": "0.28 м3",
      "Грузоподъемность": "610 кг",
      "Ширина": "1.56 м",
      "Привод": "колесный"
    },
    attachments: ["Ковш", "Вилы", "Щетка"],
    useCases: ["Погрузка грунта", "Уборка территории", "Планировка", "Перемещение паллет"],
    imagePlaceholderType: "loader",
    withOperatorAvailable: true,
    deliveryAvailable: true
  },
  {
    id: "eq-bobcat-s650",
    slug: "bobcat-s650",
    title: "Bobcat S650",
    category: "Погрузчики",
    shortDescription:
      "Мини-погрузчик для строительных площадок, складов, уборки снега и погрузочных работ.",
    pricePerShift: 11500,
    availability: "tomorrow",
    specs: {
      "Грузоподъемность": "870 кг",
      "Высота выгрузки": "3.2 м",
      "Мощность": "74 л.с.",
      "Ширина": "1.83 м",
      "Тип хода": "колесный",
      "Навесное": "щетка, вилы"
    },
    attachments: ["Ковш", "Щетка", "Вилы", "Снегоуборщик"],
    useCases: ["Погрузка", "Уборка снега", "Складские работы", "Перемещение материалов"],
    imagePlaceholderType: "loader",
    withOperatorAvailable: true,
    deliveryAvailable: true
  },
  {
    id: "eq-manitou-180-atj",
    slug: "manitou-180-atj",
    title: "Manitou 180 ATJ",
    category: "Автовышки",
    shortDescription:
      "Подъемная техника для фасадных, монтажных и электромонтажных работ на высоте.",
    pricePerShift: 14000,
    availability: "today",
    specs: {
      "Высота подъема": "18 м",
      "Грузоподъемность": "250 кг",
      "Привод": "4x4",
      "Поворот башни": "360 градусов",
      "Горизонтальный вылет": "10.6 м",
      "Питание": "дизель"
    },
    attachments: ["Люлька", "Страховочный комплект"],
    useCases: ["Фасады", "Монтаж рекламы", "Электромонтаж", "Работы на складах"],
    imagePlaceholderType: "lift",
    withOperatorAvailable: true,
    deliveryAvailable: true
  },
  {
    id: "eq-kamaz-6520",
    slug: "kamaz-6520",
    title: "Самосвал КамАЗ 6520",
    category: "Самосвалы",
    shortDescription:
      "Самосвал для вывоза грунта, доставки песка, щебня и строительных материалов.",
    pricePerShift: 15000,
    availability: "today",
    specs: {
      "Грузоподъемность": "20 т",
      "Объем кузова": "12 м3",
      "Колесная формула": "6x4",
      "Тип кузова": "самосвальный",
      "Водитель": "включен",
      "Маршруты": "Минск и Беларусь"
    },
    attachments: ["Тент", "Доставка сыпучих материалов"],
    useCases: ["Вывоз грунта", "Доставка песка", "Доставка щебня", "Снабжение объекта"],
    imagePlaceholderType: "truck",
    withOperatorAvailable: true,
    deliveryAvailable: true
  },
  {
    id: "eq-hamm-hd12",
    slug: "hamm-hd12",
    title: "Виброкаток Hamm HD 12",
    category: "Катки",
    shortDescription:
      "Компактный каток для уплотнения асфальта, основания дорожек и благоустройства.",
    pricePerShift: 9000,
    availability: "request",
    specs: {
      "Масса": "2.7 т",
      "Ширина вальца": "1.2 м",
      "Частота вибрации": "60 Гц",
      "Тип": "тандемный",
      "Двигатель": "дизель",
      "Рабочая смена": "8 часов"
    },
    attachments: ["Оператор", "Доставка"],
    useCases: ["Асфальтирование", "Дорожки", "Парковки", "Благоустройство"],
    imagePlaceholderType: "loader",
    withOperatorAvailable: true,
    deliveryAvailable: true
  },
  {
    id: "eq-hydraulic-hammer",
    slug: "hydraulic-hammer",
    title: "Гидромолот Delta F-5",
    category: "Навесное оборудование",
    shortDescription:
      "Навесной гидромолот для демонтажа бетона, кирпича и мерзлого грунта.",
    pricePerShift: 7500,
    availability: "today",
    specs: {
      "Масса": "280 кг",
      "Совместимость": "2.5-5 т",
      "Энергия удара": "650 Дж",
      "Частота": "900 уд/мин",
      "Назначение": "демонтаж",
      "Подача": "с техникой"
    },
    attachments: ["Пика", "Долото"],
    useCases: ["Демонтаж бетона", "Разрушение кирпича", "Мерзлый грунт", "Проемы"],
    imagePlaceholderType: "excavator",
    withOperatorAvailable: true,
    deliveryAvailable: true
  }
];

export const categories = [
  "Мини-экскаваторы",
  "Погрузчики",
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
  return new Intl.NumberFormat("ru-BY").format(value) + " BYN";
}

export function getEquipmentBySlug(slug: string) {
  return equipment.find((item) => item.slug === slug);
}

export function getRelatedEquipment(current: Equipment) {
  return equipment
    .filter((item) => item.id !== current.id)
    .sort((a, b) => {
      if (a.category === current.category && b.category !== current.category) return -1;
      if (a.category !== current.category && b.category === current.category) return 1;
      return a.pricePerShift - b.pricePerShift;
    })
    .slice(0, 3);
}
