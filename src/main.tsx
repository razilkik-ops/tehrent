import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./globals.css";
import { OrderModalProvider } from "@/components/OrderModal";
import { EquipmentCatalogProvider } from "@/lib/equipment-catalog";
import { getRouterBasename } from "@/lib/site-paths";
import { AdminPage } from "./pages/AdminPage";
import { EquipmentPage } from "./pages/EquipmentPage";
import { HomePage } from "./pages/HomePage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={getRouterBasename()}>
      <EquipmentCatalogProvider>
        <OrderModalProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/equipment/:slug" element={<EquipmentPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </OrderModalProvider>
      </EquipmentCatalogProvider>
    </BrowserRouter>
  </React.StrictMode>
);
