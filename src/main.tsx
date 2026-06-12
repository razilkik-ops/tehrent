import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./globals.css";
import { OrderModalProvider } from "@/components/OrderModal";
import { EquipmentPage } from "./pages/EquipmentPage";
import { HomePage } from "./pages/HomePage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <OrderModalProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/equipment/:slug" element={<EquipmentPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </OrderModalProvider>
    </BrowserRouter>
  </React.StrictMode>
);
