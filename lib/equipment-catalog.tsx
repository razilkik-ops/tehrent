import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { equipment as fallbackEquipment, type Equipment } from "./equipment";
import { buildAppPath, buildAssetUrl } from "./site-paths";

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
const equipmentCatalogUrl = buildAppPath(`/data/equipment.json?v=${encodeURIComponent(__APP_BUILD_ID__)}`);

function normalizeEquipmentAssets(items: Equipment[]) {
  return items.map((item) => ({
    ...item,
    imageUrl: buildAssetUrl(item.imageUrl),
    mobileImageUrl: buildAssetUrl(item.mobileImageUrl)
  }));
}

async function loadEquipmentFromApi() {
  const response = await fetch(equipmentCatalogUrl, {
    cache: "no-store",
    headers: {
      Accept: "application/json"
    }
  });
  if (!response.ok) {
    throw new Error("Не удалось загрузить каталог");
  }

  const data = (await response.json()) as Equipment[] | { items?: Equipment[] };
  const items = Array.isArray(data) ? data : data.items;
  return normalizeEquipmentAssets(items?.length ? items : fallbackEquipment);
}

export function EquipmentCatalogProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Equipment[]>(() => normalizeEquipmentAssets(fallbackEquipment));
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
      getEquipmentBySlug: (slug) =>
        items.find((item) => item.slug === slug || item.legacySlugs?.includes(slug)),
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
