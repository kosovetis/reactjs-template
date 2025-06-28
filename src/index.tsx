// src/index.tsx
import * as React from "react";
import { createRoot } from "react-dom/client";
import Home from "./Home";

// ⬇️  Это весь «блок создания корня» – вставь его вместо старого
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);

