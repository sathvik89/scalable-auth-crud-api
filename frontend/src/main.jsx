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
        token: {
          colorPrimary: "#2563eb",
          colorInfo: "#2563eb",
          colorLink: "#2563eb",
          borderRadius: 8,
          fontFamily:
            '"DM Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        },
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
