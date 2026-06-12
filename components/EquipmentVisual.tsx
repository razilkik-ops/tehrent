import type { ImagePlaceholderType } from "@/lib/equipment";

type EquipmentVisualProps = {
  type: ImagePlaceholderType;
  className?: string;
  imageUrl?: string;
  priorityLabel?: string;
  variant?: "card" | "hero" | "dark";
  imageFit?: "contain" | "cover";
};

const imageMap: Record<ImagePlaceholderType, string> = {
  excavator: "/images/equipment/excavator.png",
  loader: "/images/equipment/loader.png",
  backhoe: "/images/equipment/volvo-bl71-model.webp",
  lift: "/images/equipment/lift.png",
  truck: "/images/equipment/truck.png"
};

const objectPosition: Record<ImagePlaceholderType, string> = {
  excavator: "object-[58%_52%]",
  loader: "object-[50%_58%]",
  backhoe: "object-[50%_54%]",
  lift: "object-[50%_54%]",
  truck: "object-[50%_56%]"
};

export function EquipmentVisual({
  type,
  className = "",
  imageUrl,
  priorityLabel,
  variant = "card",
  imageFit = "contain"
}: EquipmentVisualProps) {
  const foregroundFitClass = imageFit === "cover" ? "object-cover" : "object-contain p-2";

  return (
    <div
      aria-label="Схематичное изображение спецтехники"
      className={`relative isolate min-h-56 overflow-hidden rounded-[28px] bg-[#dde4dc] ${className}`}
    >
      <img
        src={imageUrl || imageMap[type]}
        alt=""
        className={`absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-sm ${objectPosition[type]}`}
        loading="lazy"
      />
      <img
        src={imageUrl || imageMap[type]}
        alt=""
        className={`absolute inset-0 h-full w-full ${foregroundFitClass} ${objectPosition[type]}`}
        loading="lazy"
      />
      <span
        className={`absolute inset-0 ${
          variant === "dark"
            ? "bg-gradient-to-r from-night via-night/78 to-night/12"
            : variant === "hero"
              ? "bg-gradient-to-r from-white/58 via-white/18 to-transparent"
              : "bg-gradient-to-t from-black/10 via-transparent to-white/4"
        }`}
      />
      {variant === "hero" ? (
        <span className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white via-white/86 to-transparent" />
      ) : null}
      {priorityLabel ? (
        <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#dff0d6]/95 px-2.5 py-1 text-xs font-black text-moss shadow-sm xl:gap-2 xl:px-3 xl:py-1.5 xl:text-sm">
          <span className="grid size-4 place-items-center rounded-full bg-white text-moss xl:size-5">✓</span>
          {priorityLabel}
        </span>
      ) : null}
    </div>
  );
}
