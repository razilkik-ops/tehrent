import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./globals.css";
import { CatalogPage } from "./pages/CatalogPage";
import { EquipmentPage } from "./pages/EquipmentPage";
import { HomePage } from "./pages/HomePage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/equipment/:slug" element={<EquipmentPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
