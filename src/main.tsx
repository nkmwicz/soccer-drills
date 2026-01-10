import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./pages";
import { Drills } from "./pages/drills";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drills" element={<Drills />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
