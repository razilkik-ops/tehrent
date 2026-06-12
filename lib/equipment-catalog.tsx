import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { equipment as fallbackEquipment, type Equipment } from "./equipment";

type EquipmentCatalogContextValue = {
  equipment: Equipment[];
  loading: boolean;
  error: string | null;
  refreshEquipment: () => Promise<void>;
  getEquipmentBySlug: (slug: string) => Equipment | undefined;
  getEquipmentById: (id: string) => Equipment | undefined;
  getRelatedEquipment: (current: Equipment) => Equipment[];
};

const EquipmentCatalogContext = createContext<EquipmentCatalogContextValue | null>(null);

async function loadEquipmentFromApi() {
  const response = await fetch("/api/equipment");
  if (!response.ok) {
    throw new Error("Не удалось загрузить каталог");
  }

  const data = (await response.json()) as { items?: Equipment[] };
  return data.items?.length ? data.items : fallbackEquipment;
}

export function EquipmentCatalogProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Equipment[]>(fallbackEquipment);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshEquipment() {
    setLoading(true);
    try {
      setItems(await loadEquipmentFromApi());
      setError(null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Не удалось загрузить каталог");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshEquipment();
  }, []);

  const value = useMemo<EquipmentCatalogContextValue>(
    () => ({
      equipment: items,
      loading,
      error,
      refreshEquipment,
      getEquipmentBySlug: (slug) => items.find((item) => item.slug === slug),
      getEquipmentById: (id) => items.find((item) => item.id === id),
      getRelatedEquipment: (current) =>
        items
          .filter((item) => item.id !== current.id)
          .sort((a, b) => {
            if (a.category === current.category && b.category !== current.category) return -1;
            if (a.category !== current.category && b.category === current.category) return 1;
            return a.pricePerShift - b.pricePerShift;
          })
          .slice(0, 3)
    }),
    [error, items, loading]
  );

  return <EquipmentCatalogContext.Provider value={value}>{children}</EquipmentCatalogContext.Provider>;
}

export function useEquipmentCatalog() {
  const context = useContext(EquipmentCatalogContext);

  if (!context) {
    throw new Error("useEquipmentCatalog must be used inside EquipmentCatalogProvider");
  }

  return context;
}
