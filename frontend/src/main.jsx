import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App as AntdApp, ConfigProvider } from "antd";
import AppRoot from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#2563eb", borderRadius: 6 },
      }}
    >
      <AntdApp>
        <BrowserRouter>
          <AppRoot />
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
);
