import { CalendarCheck, X } from "lucide-react";
import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import { useEquipmentCatalog } from "@/lib/equipment-catalog";
import type { Equipment } from "@/lib/equipment";
import { QuickRequestForm } from "./QuickRequestForm";

type OrderModalPayload = {
  sourcePage?: string;
  equipmentId?: string;
  selectedEquipment?: string[];
  formType?: string;
  hiddenTask?: string;
  equipmentTitle?: string;
  summaryItems?: Array<{
    label: string;
    value: string;
  }>;
};

type OrderModalContextValue = {
  openOrderModal: (payload?: OrderModalPayload) => void;
  closeOrderModal: () => void;
};

const OrderModalContext = createContext<OrderModalContextValue | null>(null);

function getCurrentSourcePage() {
  if (typeof window === "undefined") {
    return "site";
  }

  return `${window.location.pathname}${window.location.hash}`;
}

function getCurrentEquipmentFromUrl(getEquipmentBySlug: (slug: string) => Equipment | undefined) {
  if (typeof window === "undefined") {
    return undefined;
  }

  const match = window.location.pathname.match(/^\/equipment\/([^/]+)/);
  if (!match) {
    return undefined;
  }

  return getEquipmentBySlug(decodeURIComponent(match[1]));
}

function getEquipmentFromPayload(
  payload: OrderModalPayload,
  getEquipmentById: (id: string) => Equipment | undefined,
  getEquipmentBySlug: (slug: string) => Equipment | undefined
) {
  const payloadEquipmentId = payload.equipmentId || payload.selectedEquipment?.[0];

  if (payloadEquipmentId) {
    return getEquipmentById(payloadEquipmentId);
  }

  return getCurrentEquipmentFromUrl(getEquipmentBySlug);
}

function getHiddenTask(payload: OrderModalPayload, item?: Equipment) {
  const defaultTask = payload.hiddenTask || "Заявка с кнопки Заказать";

  if (!item) {
    return defaultTask;
  }

  if (defaultTask.includes(item.title)) {
    return defaultTask;
  }

  return `${defaultTask}. Техника: ${item.title}`;
}

export function OrderModalProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<OrderModalPayload | null>(null);
  const { getEquipmentById, getEquipmentBySlug } = useEquipmentCatalog();
  const payloadEquipment = payload ? getEquipmentFromPayload(payload, getEquipmentById, getEquipmentBySlug) : undefined;
  const equipmentTitle = payload?.equipmentTitle || payloadEquipment?.title;
  const equipmentId = payload?.equipmentId || payloadEquipment?.id || "";
  const selectedEquipment = payload?.selectedEquipment || (equipmentId ? [equipmentId] : []);

  const value = useMemo<OrderModalContextValue>(
    () => ({
      openOrderModal: (nextPayload = {}) => setPayload(nextPayload),
      closeOrderModal: () => setPayload(null)
    }),
    []
  );

  return (
    <OrderModalContext.Provider value={value}>
      {children}
      {payload ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-night/62 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-modal-title"
          onClick={() => setPayload(null)}
        >
          <div
            className="max-h-[calc(100dvh-2rem)] w-full max-w-[520px] overflow-y-auto rounded-[20px] border border-accent/28 bg-white p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:max-h-[calc(100dvh-3rem)] sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4 px-1 pt-1">
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-accent text-night">
                  <CalendarCheck size={22} />
                </span>
                <div>
                  <h2 id="order-modal-title" className="text-xl font-black leading-tight text-ink">
                    Перезвоним за 5 минут
                  </h2>
                  <p className="mt-1 text-xs font-semibold leading-5 text-ink/58">
                    Оставьте имя и телефон, мы быстро уточним задачу.
                  </p>
                  {equipmentTitle ? (
                    <p className="mt-2 inline-flex rounded-full bg-accent/14 px-3 py-1 text-[11px] font-black leading-4 text-ink">
                      Техника: {equipmentTitle}
                    </p>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                className="focus-ring grid size-10 shrink-0 place-items-center rounded-[10px] border border-ink/10 bg-paper text-ink"
                aria-label="Закрыть форму"
                onClick={() => setPayload(null)}
              >
                <X size={20} />
              </button>
            </div>
            {payload.summaryItems?.length ? (
              <div className="mb-4 grid gap-2 rounded-[14px] bg-paper p-3 text-ink sm:grid-cols-2">
                {payload.summaryItems.map((item) => (
                  <div key={item.label} className="rounded-[10px] bg-white px-3 py-2">
                    <p className="text-[11px] font-black uppercase leading-4 text-ink/42">{item.label}</p>
                    <p className="mt-0.5 text-sm font-black leading-5 text-ink">{item.value}</p>
                  </div>
                ))}
              </div>
            ) : null}
            <QuickRequestForm
              id="order-modal-lead"
              sourcePage={payload.sourcePage || getCurrentSourcePage()}
              variant="modal"
              equipmentId={equipmentId}
              selectedEquipment={selectedEquipment}
              formType={payload.formType || "order-modal"}
              hiddenTask={getHiddenTask(payload, payloadEquipment)}
            />
          </div>
        </div>
      ) : null}
    </OrderModalContext.Provider>
  );
}

export function useOrderModal() {
  const context = useContext(OrderModalContext);

  if (!context) {
    throw new Error("useOrderModal must be used inside OrderModalProvider");
  }

  return context;
}
